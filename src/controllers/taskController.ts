import type { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../libs/prisma.js';

class TaskController {
  async create(request: Request, response: Response) {
    const paramsSchema = z.object({
      teamId: z.uuid(),
    });
    const bodySchema = z.object({
      title: z.string().min(2),
      description: z.string().trim().max(200).optional(),
      priority: z.enum(['high', 'medium', 'low']),
      assignedTo: z.uuid(),
    });

    const { teamId } = paramsSchema.parse(request.params);
    const {
      assignedTo: userId,
      description,
      priority,
      title,
    } = bodySchema.parse(request.body);

    const task = await prisma.task.create({
      data: {
        title,
        description: description ?? null,
        priority,
        assigned_to: { connect: { id: userId } },
        team: { connect: { id: teamId } },
      },
    });
    return response.status(201).json(task);
  }

  async index(_request: Request, response: Response) {
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return response.status(200).json(tasks);
  }
}

export { TaskController };
