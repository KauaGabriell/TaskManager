import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { authConfig } from '../configs/auth.js';
import { prisma } from '../libs/prisma.js';
import { AppError } from '../utils/AppError.js';
import { verifyPassword } from '../utils/hashAndVerifyPassword.js';

class SessionController {
  async login(request: Request, response: Response) {
    const bodySchema = z.object({
      email: z.email().transform((email) => email.trim().toLowerCase()),
      password: z.string().min(6),
    });

    const { email, password } = bodySchema.parse(request.body);
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) throw new AppError('Authentication Failed', 401);

    const passwordMatch = await verifyPassword(password, user.password);
    if (!passwordMatch) throw new AppError('Authentication Failed', 401);

    const { secret, expiresIn } = authConfig.jwt;
    const token = jwt.sign({ role: user.role }, secret, {
      subject: user.id,
      expiresIn,
    });

    const { password: _password, ...userWithoutPassword } = user;
    return response.status(200).json({ token, user: userWithoutPassword });
  }
}

export { SessionController };
