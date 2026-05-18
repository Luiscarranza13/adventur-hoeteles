import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

type ApiErrorCode =
  | 'BAD_REQUEST'
  | 'UNAUTHENTICATED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'INTERNAL_ERROR';

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export function apiError(message: string, status = 500, code: ApiErrorCode = 'INTERNAL_ERROR') {
  return NextResponse.json({ error: message, code }, { status });
}

export function validationError(error: ZodError) {
  return NextResponse.json(
    {
      error: 'Datos invalidos',
      code: 'VALIDATION_ERROR',
      detalles: error.issues.map(issue => ({
        campo: issue.path.join('.'),
        mensaje: issue.message,
      })),
    },
    { status: 400 },
  );
}

export function logApiError(scope: string, error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[${scope}]`, message);
}
