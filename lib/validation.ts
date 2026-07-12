/**
 * lib/validation.ts
 * Zod validation schemas for all API inputs.
 * Rule #3: Validate ALL inputs server-side using Zod schemas.
 * Compatible with Zod v4+ (uses 'error' not 'errorMap').
 */

import { z } from 'zod';

// ─── Report Builder ─────────────────────────────────────────────────────────
export const ReportRequestSchema = z.object({
  type: z.enum(['environmental', 'social', 'governance', 'combined']),
  quarter: z.enum(['Q1', 'Q2', 'Q3', 'Q4']),
  year: z.number().int().min(2020).max(2100).optional(),
  format: z.enum(['PDF', 'Excel', 'CSV']),
  department: z.string().max(100).optional(),
});

export type ReportRequest = z.infer<typeof ReportRequestSchema>;

// ─── ESG Oracle / LLM ───────────────────────────────────────────────────────
export const OracleQuerySchema = z.object({
  query: z
    .string()
    .min(1, 'Query cannot be empty')
    .max(500, 'Query too long — max 500 characters')
    .trim()
    .transform((val) =>
      val
        .replace(/ignore previous instructions/gi, '')
        .replace(/system:/gi, '')
        .replace(/\[INST\]/gi, '')
        .replace(/<\|.*?\|>/g, '')
    ),
  sessionId: z.string().uuid().optional(),
});

export type OracleQuery = z.infer<typeof OracleQuerySchema>;

// ─── File Upload ─────────────────────────────────────────────────────────────
export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/pdf',
] as const;

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;  // 5MB
export const MAX_DOC_SIZE_BYTES   = 25 * 1024 * 1024; // 25MB

export const FileUploadSchema = z.object({
  mimeType: z.enum(ALLOWED_MIME_TYPES),
  sizeBytes: z.number().max(MAX_DOC_SIZE_BYTES, 'File too large'),
  originalName: z
    .string()
    .max(255)
    .regex(/^[\w\-. ]+$/, 'Invalid filename'),
});

// ─── Carbon Transaction (Anomaly Detection) ─────────────────────────────────
export const CarbonTransactionSchema = z.object({
  departmentId: z.string().uuid(),
  kgCo2: z
    .number()
    .positive('CO₂ value must be positive')
    .max(100_000, 'CO₂ value exceeds maximum'),
  date: z.iso.datetime(),
  notes: z.string().max(500).optional(),
});

export type CarbonTransaction = z.infer<typeof CarbonTransactionSchema>;

// ─── User / Auth ─────────────────────────────────────────────────────────────
export const LoginSchema = z.object({
  email: z.string().email('Invalid email').max(254),
  password: z.string().min(8, 'Password too short').max(128),
});

export const RegisterSchema = LoginSchema.extend({
  name: z.string().min(2).max(100).trim(),
  role: z.enum(['employee', 'manager', 'admin']).default('employee'),
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;

// ─── Utility: safe parse helper ─────────────────────────────────────────────
export function safeValidate<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { data: T; error: null } | { data: null; error: string } {
  const result = schema.safeParse(data);
  if (result.success) return { data: result.data, error: null };
  const firstError = result.error.issues[0];
  return { data: null, error: firstError?.message ?? 'Validation failed' };
}
