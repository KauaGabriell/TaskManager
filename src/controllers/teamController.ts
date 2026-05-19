import type { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../libs/prisma.js';
import { AppError } from '../utils/AppError.js';

class TeamController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string().min(2),
      description: z.string().trim().optional(),
    });

    const { name, description } = bodySchema.parse(request.body);

    const team = await prisma.team.create({
      data: {
        name,
        description,
      },
    });
    if (!team) throw new AppError('Not Created', 401);

    return response.status(201).json(team);
  }
  async index(_request: Request, response: Response) {
    const teams = await prisma.team.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return response.status(200).json(teams);
  }
}

export { TeamController };
