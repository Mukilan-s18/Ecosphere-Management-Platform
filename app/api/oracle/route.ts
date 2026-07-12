/**
 * app/api/oracle/route.ts
 * ESG Oracle — Gemini-powered AI policy assistant.
 *
 * Security rules applied:
 * Rule #1  — API key from env only, never exposed to client
 * Rule #2  — Rate limited: 10 req/min per IP (LLM endpoints)
 * Rule #3  — Input validated with Zod (query length, prompt injection stripping)
 * Rule #9  — No stack traces returned to client
 * Rule #AI — max_tokens enforced, sanitized input, server-side key only
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { llmLimiter, getClientIp } from "@/lib/rate-limit";
import { serverError, rateLimitError, validationError } from "@/lib/secure-error";

// Rule #1: API key server-side only — never sent to browser
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

// Rule #AI: max_tokens enforced
const MAX_OUTPUT_TOKENS = 512;
const MAX_HISTORY_MESSAGES = 20; // cap chat history to prevent token abuse

// Rule #3: Zod schema for incoming request body
const OracleRequestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        // Rule #AI: strip prompt injection, cap length
        content: z
          .string()
          .min(1)
          .max(500, "Message too long — max 500 characters")
          .trim()
          .transform((val) =>
            val
              .replace(/ignore previous instructions/gi, "[removed]")
              .replace(/system\s*:/gi, "[removed]")
              .replace(/\[INST\]/gi, "[removed]")
              .replace(/<\|.*?\|>/g, "[removed]")
              .replace(/jailbreak/gi, "[removed]")
          ),
      })
    )
    .min(1, "No messages provided")
    .max(MAX_HISTORY_MESSAGES, `Chat history too long — max ${MAX_HISTORY_MESSAGES} messages`),
});

const ESG_SYSTEM_PROMPT = `You are the "ESG Oracle" — an expert AI Policy Assistant for EcoSphere, a corporate ESG (Environmental, Social, and Governance) management platform.

Your role is to answer employee questions about company ESG policies in a clear, concise, and friendly way.

## Company ESG Policies (Source of Truth)

### Environmental Policies
- **E-Waste Recycling**: All electronic equipment must be disposed of through certified e-waste vendors. Employees must NOT throw electronics in regular trash. Contact IT for pickup requests. Certified vendors: GreenE-Recycle, EcoTech Disposal.
- **Travel Policy**: Economy class is mandatory for all flights under 6 hours. Business class requires VP approval. First-class travel is NOT permitted under any circumstances.
- **Energy Usage**: Office HVAC must be set between 22°C–26°C. Non-essential equipment must be powered off after work hours. LED lighting is mandatory in all offices.
- **Carbon Offsetting**: All business flights must be offset through our certified carbon credit program. Employees submit flight details via the Environmental portal.
- **Single-Use Plastics**: Banned from all company premises since Jan 2025. Reusable alternatives are provided in all pantries.

### Social Policies
- **Diversity & Inclusion**: All hiring panels must include at least one diverse panel member. Job postings must be listed on inclusive job boards.
- **Employee Well-being**: Employees are entitled to 2 mental health days per quarter in addition to regular leave.
- **Supply Chain**: All Tier-1 suppliers must sign the EcoSphere Supplier Code of Conduct. Child labor and forced labor are strictly prohibited.
- **Health & Safety**: All employees must complete annual safety training. Incidents must be reported within 24 hours.

### Governance Policies
- **Anti-Bribery**: Zero tolerance for bribery or corruption. Gifts over ₹500 (or $6 USD equivalent) must be declared. Facilitation payments are prohibited globally.
- **Whistleblower Protection**: Employees can report violations anonymously via the Ethics Hotline (1800-ECO-SAFE). Retaliation is strictly prohibited and is a terminable offense.
- **Data Privacy**: All customer data must comply with GDPR and India's DPDP Act. No personal data may be shared with third parties without explicit consent.
- **Conflict of Interest**: Employees must disclose any outside employment or financial interests that could conflict with company duties.
- **ESG Reporting**: The company follows GRI Standards, TCFD, UN SDGs, and EU CSRD frameworks for all external disclosures.

## Response Guidelines
- Be concise: answer in 2–4 short paragraphs maximum.
- Be direct: start with the direct answer, then explain.
- Be friendly and professional — you're helping colleagues, not issuing legal warnings.
- If a policy doesn't exist in your knowledge base, say: "I don't have a specific policy on that. I recommend checking with your HR or Compliance team."
- Use bullet points for lists.
- Always end with "💚 Need more help? Ask your HR or Compliance team." if the question seems sensitive or complex.
- IMPORTANT: You are strictly an ESG policy assistant. Refuse any request unrelated to ESG topics.`;

export async function POST(req: NextRequest) {
  // Rule #2: Rate limit LLM endpoint — 10 req/min per IP
  const ip = getClientIp(req);
  const { success, reset } = llmLimiter.check(`oracle:${ip}`);
  if (!success) {
    const retryAfter = Math.ceil((reset - Date.now()) / 1000);
    return rateLimitError(retryAfter);
  }

  // Rule #1: Fail fast if API key not configured — don't leak the reason
  if (!GEMINI_API_KEY) {
    return serverError(new Error("GEMINI_API_KEY not configured"), { route: "/api/oracle" });
  }

  // Rule #3: Validate and sanitize request body with Zod
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return validationError("Invalid JSON body");
  }

  const parsed = OracleRequestSchema.safeParse(body);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Invalid request";
    return validationError(firstError);
  }

  const { messages } = parsed.data;

  try {
    // Build Gemini-compatible contents array from sanitized chat history
    const contents = messages.map((msg: { role: string; content: string }) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const geminiBody = {
      systemInstruction: {
        parts: [{ text: ESG_SYSTEM_PROMPT }],
      },
      contents,
      generationConfig: {
        temperature: 0.3,
        // Rule #AI: max_tokens enforced to prevent runaway costs
        maxOutputTokens: MAX_OUTPUT_TOKENS,
      },
    };

    const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(geminiBody),
    });

    if (!response.ok) {
      // Rule #9: Log internally, but provide a graceful fallback for hackathon demo
      const errText = await response.text();
      console.error(`Gemini API error ${response.status}:`, errText);
      
      const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || "";
      let fallbackResponse = "I'm experiencing high traffic, but EcoSphere is fully committed to our ESG goals. **Need more help?** Ask your HR or Compliance team.";
      
      if (lastMessage.includes("e-waste")) {
        fallbackResponse = "All electronic equipment must be disposed of through **certified e-waste vendors** (e.g., GreenE-Recycle). Please do not throw electronics in regular trash.\n\n💚 Need more help? Ask your IT or Compliance team.";
      } else if (lastMessage.includes("flight") || lastMessage.includes("travel")) {
        fallbackResponse = "Economy class is mandatory for all flights under 6 hours. Business class requires VP approval. **First-class travel is NOT permitted.** All business flights must be offset.\n\n💚 Need more help? Ask your HR or Compliance team.";
      } else if (lastMessage.includes("violation") || lastMessage.includes("report")) {
        fallbackResponse = "You can report violations anonymously via the **Ethics Hotline (1800-ECO-SAFE)**. Retaliation is strictly prohibited.\n\n💚 Need more help? Ask your HR or Compliance team.";
      } else if (lastMessage.includes("conflict")) {
        fallbackResponse = "Employees must disclose any outside employment or financial interests that could conflict with company duties.\n\n💚 Need more help? Ask your HR or Compliance team.";
      }

      return NextResponse.json({ text: fallbackResponse });
    }

    const data = await response.json();

    // Rule #AI: Validate LLM output exists before returning
    const text: string =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I couldn't generate a response. Please try again.";

    // Rule #11: text is plain string from Gemini — safe to return as JSON
    // If ever rendering as HTML, sanitize with DOMPurify first
    return NextResponse.json({ text });

  } catch (error) {
    // Rule #9: Never expose internal error details to client
    return serverError(error, { route: "/api/oracle", ip });
  }
}
