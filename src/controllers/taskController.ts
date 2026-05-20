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
  async index(request: Request, response: Response) {
    const querySchema = z.object({
      status: z.enum(['pending', 'in_progress', 'completed']).optional(),
      priority: z.enum(['high', 'medium', 'low']).optional(),
    });
    const { status, priority } = querySchema.parse(request.query);
    const tasks = await prisma.task.findMany({
      where: { status, priority },
      orderBy: { createdAt: 'desc' },
    });

    return response.status(200).json(tasks);
  }
  async update(request: Request, response: Response) {
    const paramsSchema = z.object({
      taskId: z.uuid(),
    });
    const bodySchema = z.object({
      title: z.string().min(2),
      description: z.string().trim().max(200),
      priority: z.enum(['high', 'medium', 'low']),
      assignedTo: z.uuid(),
    });
    const { taskId } = paramsSchema.parse(request.params);
    const { title, description, priority, assignedTo } = bodySchema.parse(
      request.body,
    );

    const newTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        title,
        description,
        priority,
        assigned_to: { connect: { id: assignedTo } },
      },
    });

    return response.status(200).json(newTask);
  }
  async delete(request: Request, response: Response) {
    const paramsSchema = z.object({
      taskId: z.uuid(),
    });
    const { taskId } = paramsSchema.parse(request.params);

    await prisma.task.delete({ where: { id: taskId } });

    return response.status(200).json({ message: 'Deleted successfully' });
  }
}

export { TaskController };
