import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../libs/prisma.js';
import { AppError } from '../utils/AppError.js';
import { hashPassword } from '../utils/hashAndVerifyPassword.js';

class UserController {
  async create(request: Request, response: Response, next: NextFunction) {
    const bodySchema = z.object({
      name: z.string().min(2),
      email: z.email(),
      password: z.string().min(4),
    });

    const { name, email, password } = bodySchema.parse(request.body);
    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    console.log(user);
    if (!user) throw new AppError('Not Created', 404);

    return response.status(201).json(user);
  }
}

export { UserController };
