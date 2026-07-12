/**
 * lib/secure-error.ts
 * Rule #9: Never return stack traces or internal paths to the client.
 * All API routes use these helpers to return safe error responses.
 */

import { NextResponse } from 'next/server';

type ErrorSeverity = 'info' | 'warn' | 'error';

interface ServerLogContext {
  route?: string;
  userId?: string;
  method?: string;
  [key: string]: unknown;
}

/**
 * Log an error server-side with structured context.
 * In production, this would send to Sentry/Datadog/Logtail.
 */
export function logError(
  err: unknown,
  context: ServerLogContext = {},
  severity: ErrorSeverity = 'error'
): void {
  const entry = {
    timestamp: new Date().toISOString(),
    severity,
    message: err instanceof Error ? err.message : String(err),
    stack: process.env.NODE_ENV === 'development' && err instanceof Error
      ? err.stack
      : undefined,
    ...context,
  };

  if (severity === 'error') {
    console.error(JSON.stringify(entry));
  } else if (severity === 'warn') {
    console.warn(JSON.stringify(entry));
  } else {
    console.info(JSON.stringify(entry));
  }

  // TODO: In production, forward to Sentry:
  // Sentry.captureException(err, { extra: context });
}

/**
 * Return a safe 500 response — never exposes internals.
 */
export function serverError(err: unknown, context?: ServerLogContext): NextResponse {
  logError(err, context, 'error');
  return NextResponse.json(
    { error: 'Something went wrong. Please try again later.' },
    { status: 500 }
  );
}

/**
 * Return a safe 400 validation error.
 */
export function validationError(message: string): NextResponse {
  return NextResponse.json({ error: message }, { status: 400 });
}

/**
 * Return a safe 429 rate limit error.
 */
export function rateLimitError(retryAfterSeconds = 60): NextResponse {
  return NextResponse.json(
    { error: 'Too many requests. Please slow down.' },
    {
      status: 429,
      headers: { 'Retry-After': String(retryAfterSeconds) },
    }
  );
}

/**
 * Return a safe 403 forbidden error.
 */
export function forbiddenError(): NextResponse {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}

/**
 * Return a safe 401 unauthorized error.
 */
export function unauthorizedError(): NextResponse {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
