import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { authConfig } from '../configs/auth.js';
import { AppError } from '../utils/AppError.js';

interface TokenPayload {
  role: string;
  sub: string;
}

export function ensureAuthentication(
  request: Request,
  _response: Response,
  next: NextFunction,
) {
  const headers = request.headers.authorization;
  if (!headers) throw new AppError('Token is missing', 401);

  const [, token] = headers.split(' ');
  if (!token) throw new AppError('Token is not Valid', 401);
  try {
    const { role, sub: user_id } = jwt.verify(
      token,
      authConfig.jwt.secret,
    ) as TokenPayload;
    request.user = { id: user_id, role };
  } catch (_e) {
    throw new AppError('Invalid JWT Token', 401);
  }
  next();
}
