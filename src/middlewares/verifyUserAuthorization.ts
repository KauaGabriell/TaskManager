import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/AppError.js';

export function verifyUserAuthorization(role: string[]) {
  return (request: Request, _response: Response, next: NextFunction) => {
    if (!request.user) throw new AppError('Unauthorized', 401);

    if (!role.includes(request.user.role))
      throw new AppError('Unauthorized', 401);

    next();
  };
}
