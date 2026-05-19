import type { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../libs/prisma.js';
import { AppError } from '../utils/AppError.js';
import { hashPassword } from '../utils/hashAndVerifyPassword.js';

class UserController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string().min(2),
      email: z.email().transform((email) => email.trim().toLocaleLowerCase()),
      password: z.string().min(6),
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
  
    if (!user) throw new AppError('Not Created', 404);

    return response.status(201).json(user);
  }
  async index(_request: Request, response: Response) {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return response.status(200).json(users);
  }
}

export { UserController };
