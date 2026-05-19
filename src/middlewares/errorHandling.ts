import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/AppError.js';

type PrismaError = {
  code?: string;
};

export function errorHandling(
  error: unknown,
  _request: Request,
  response: Response,
  _next: NextFunction,
) {
  if (error instanceof AppError)
    return response.status(error.statusCode).json({ message: error.message });

  if (error instanceof ZodError)
    return response.status(400).json({ message: error.message });

  if (isPrismaError(error) && error.code === 'P2025')
    return response.status(404).json({ message: 'Resource not found' });

  if (isPrismaError(error) && error.code === 'P2002')
    return response.status(409).json({ message: 'Resource already exists' });

  if (isPrismaError(error) && error.code === 'P2003')
    return response.status(404).json({ message: 'Related resource not found' });

  return response.status(500).json({ message: 'Internal Server Error' });
}

function isPrismaError(error: unknown): error is PrismaError {
  return typeof error === 'object' && error !== null && 'code' in error;
}
