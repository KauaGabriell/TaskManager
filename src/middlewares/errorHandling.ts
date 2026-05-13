import type { Response } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/AppError.js';

export function errorHandling(error: unknown, response: Response) {
  if (error instanceof AppError)
    return response.status(error.statusCode).json({ message: error.message });

  if (error instanceof ZodError)
    return response.status(400).json({ message: error.message });

  return response.status(500).json({ message: 'Internal Server Error' });
}
