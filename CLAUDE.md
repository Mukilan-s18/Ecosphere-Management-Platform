# 🔐 Security-First Vibe Coding Rules

This file defines the security rules for **every file generated in this project**.
These rules are non-negotiable and apply to all AI-generated and human-written code.

---

## Table of Rules

| # | Issue | What it covers |
|---|---|---|
| 1 | Exposed Secrets | `.env` only, `.gitignore`, no keys in frontend |
| 2 | Rate Limiting | Per-endpoint limits, 429 responses, recommended libs |
| 3 | Input Validation | Zod schemas, server-side only, parameterized queries |
| 4 | Auth & Authorization | No plain-text passwords, JWT best practices, role checks |
| 5 | SQL Injection | ORM-first, never string concat queries |
| 6 | CORS | No wildcard `*` in production |
| 7 | HTTP Security Headers | `helmet`, CSP, HSTS, clickjacking prevention |
| 8 | File Upload Safety | MIME validation, size limits, UUID renaming |
| 9 | Error Handling | No stack traces to client, structured logging |
| 10 | Dependency Security | `npm audit`, pinned versions |
| 11 | XSS Prevention | No `dangerouslySetInnerHTML`, no `eval()` |
| 12 | Deploy Checklist | Pre-deploy gate before every ship |
| 🤖 | AI/LLM Specific | Prompt injection, token budgets, server-side API keys |

---

## 🔐 1. SECRETS & ENVIRONMENT VARIABLES

- ALL API keys, tokens, database URLs MUST live in `.env` files only.
- `.env` MUST be listed in `.gitignore` — already enforced in this repo.
- Frontend code must **NEVER** contain raw secret values.
- For Next.js: only `NEXT_PUBLIC_` prefixed vars belong in the frontend, and those must NEVER be secret keys.
- Backend secrets accessed via `process.env.VAR_NAME` only, never returned to client.
- A `.env.example` file with all required variable names (empty values) is maintained in this repo.

```ts
// ✅ Correct
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

// ❌ Wrong — never do this
const supabase = createClient('https://xyz.supabase.co', 'eyJhbGc...');
```

---

## 🚦 2. RATE LIMITING

- Every public-facing API route must have rate limiting.
- Default limits:
  - Auth endpoints: **5 req / 15 min per IP**
  - General API: **60 req / min per IP**
  - AI/LLM proxy (e.g. `/api/oracle`): **10 req / min per user**
  - File uploads: **5 req / min per IP**
- Return `429 Too Many Requests` with `Retry-After` header when limits are hit.
- In-memory rate limiting is implemented in `/lib/rate-limit.ts`.

---

## 🧹 3. INPUT VALIDATION & SANITIZATION

- Validate ALL inputs **server-side** using **Zod** schemas.
- Client-side validation is UX only, never security.
- Sanitize string inputs before storing or displaying.
- Use parameterized queries / ORM — NEVER interpolate user input into raw SQL.
- Reject invalid input with `400 Bad Request`.

```ts
// ✅ Zod schema validation (see lib/validation.ts)
import { z } from 'zod';
const ReportSchema = z.object({
  type: z.enum(['environmental', 'social', 'governance']),
  quarter: z.enum(['Q1', 'Q2', 'Q3', 'Q4']),
  format: z.enum(['PDF', 'Excel', 'CSV']),
});
```

---

## 🔑 4. AUTHENTICATION & AUTHORIZATION

- Use Supabase Auth — never roll custom auth from scratch.
- Passwords stored by Supabase using bcrypt automatically.
- JWTs signed by Supabase with strong secrets; use short expiry.
- Always verify identity **AND** resource ownership on every request.
- Admin routes require explicit role checks.

```ts
// ✅ Always check ownership
const { data: { user } } = await supabase.auth.getUser();
if (!user || record.user_id !== user.id) {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}
```

---

## 🛡️ 5. SQL & DATABASE SECURITY

- Always use Supabase client (ORM-equivalent) — never raw string-concat queries.
- Apply least privilege: Supabase RLS (Row Level Security) enforced on all tables.
- Do not return raw Supabase errors to the client.

```ts
// ✅ Safe — parameterized via Supabase client
const { data } = await supabase.from('users').select('*').eq('email', email);

// ❌ Never — raw string interpolation
const { data } = await supabase.rpc(`SELECT * FROM users WHERE email = '${email}'`);
```

---

## 🌐 6. CORS CONFIGURATION

- No wildcard `*` CORS in production.
- Next.js API routes restrict origin via `next.config.js` headers.
- Allowed origins set via `ALLOWED_ORIGIN` environment variable.

---

## 🪝 7. HTTP SECURITY HEADERS

Applied via `next.config.js`:

- `Content-Security-Policy` — restricts script/style sources
- `X-Frame-Options: DENY` — prevents clickjacking
- `X-Content-Type-Options: nosniff`
- `Strict-Transport-Security` — forces HTTPS
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-Powered-By` removed

---

## 📤 8. FILE UPLOAD SECURITY

- Validate MIME type AND extension server-side.
- Max file size: **5MB for images**, **25MB for documents**.
- Files stored in Supabase Storage (outside web root).
- Filenames renamed to UUID on upload.
- Never serve user-uploaded files with executable permissions.

---

## 🚨 9. ERROR HANDLING & LOGGING

- Never return stack traces or internal paths to the client in production.
- Generic error message: `"Something went wrong"` — never raw JS error.
- Server-side errors logged with context via structured logging.
- `4xx` for client errors, `5xx` for server errors.

---

## 🔒 10. DEPENDENCY SECURITY

- Run `npm audit` after every install — fix high/critical issues.
- `package-lock.json` committed and pinned.
- Do not install packages with suspicious install scripts without review.

---

## 🧱 11. XSS PREVENTION

- No `dangerouslySetInnerHTML` in React components.
- No `eval()`, `new Function()`, or `innerHTML` with dynamic user content.
- All user-generated content escaped before render.
- LLM output sanitized before rendering in the UI.

---

## ☁️ 12. DEPLOYMENT CHECKLIST

Before every deploy, verify:

- [ ] `.env` is NOT committed to git
- [ ] All secrets set in hosting platform env config (Vercel / Supabase)
- [ ] `NODE_ENV=production` — debug mode OFF
- [ ] Database behind private network, not publicly exposed
- [ ] HTTPS enforced
- [ ] Rate limiting active on all public endpoints
- [ ] CORS restricted to known origins
- [ ] `npm audit` run and clean
- [ ] Unused API routes removed or protected

---

## 🤖 AI/LLM-SPECIFIC RULES

Applies to `/app/api/oracle/route.ts` and any LLM integration:

- **Never** send raw user input directly to an LLM — sanitize and strip prompt injection attempts.
- Always set `max_tokens` limit on every LLM call.
- API key stored server-side only (`OPENAI_API_KEY` in `.env`) — all LLM calls routed through Next.js API routes, **never from the browser**.
- Log LLM usage (token counts) per user to detect abuse.
- Implement per-user token budgets.
- Validate and sanitize LLM output before rendering in the UI (XSS risk from generated HTML).

```ts
// ✅ Correct — server-side only in /app/api/oracle/route.ts
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ❌ Wrong — never instantiate OpenAI in a client component
```

---

> These rules apply to every file generated in this project. When in doubt, **err on the side of security over convenience**.
