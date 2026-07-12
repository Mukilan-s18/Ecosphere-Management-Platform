import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

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
- Always end with "💚 Need more help? Ask your HR or Compliance team." if the question seems sensitive or complex.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured." },
        { status: 500 }
      );
    }

    // Build Gemini-compatible contents array from chat history
    const contents = messages.map(
      (msg: { role: string; content: string }) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      })
    );

    const body = {
      systemInstruction: {
        parts: [{ text: ESG_SYSTEM_PROMPT }],
      },
      contents,
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 512,
      },
    };

    const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini API error:", errText);
      
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
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I couldn't generate a response. Please try again.";

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Oracle route error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
