import type { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../libs/prisma.js';
import { AppError } from '../utils/AppError.js';

class TaskController {
  async create(request: Request, response: Response) {
    const isAdmin = request.user.role === 'admin';
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

    if (!isAdmin) {
      await prisma.teamMember.findUniqueOrThrow({
        where: {
          user_id_team_id: {
            user_id: request.user.id,
            team_id: teamId,
          },
        },
      });
    }

    await prisma.teamMember.findUniqueOrThrow({
      where: {
        user_id_team_id: {
          user_id: userId,
          team_id: teamId,
        },
      },
    });

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
    const isAdmin = request.user.role === 'admin';
    const querySchema = z.object({
      status: z.enum(['pending', 'in_progress', 'completed']).optional(),
      priority: z.enum(['high', 'medium', 'low']).optional(),
    });
    const { status, priority } = querySchema.parse(request.query);
    const tasks = await prisma.task.findMany({
      where: {
        status,
        priority,
        ...(isAdmin ? {} : { user_id: request.user.id }),
      },
      orderBy: { createdAt: 'desc' },
    });

    return response.status(200).json(tasks);
  }
  async update(request: Request, response: Response) {
    const isAdmin = request.user.role === 'admin';
    const paramsSchema = z.object({
      taskId: z.uuid(),
    });
    const bodySchema = z.object({
      title: z.string().min(2),
      description: z.string().trim().max(200),
      priority: z.enum(['high', 'medium', 'low']),
    });
    const { taskId } = paramsSchema.parse(request.params);
    const { title, description, priority  } = bodySchema.parse(request.body);

    const newTask = await prisma.task.update({
      where: { id: taskId, ...(isAdmin ? {} : { user_id: request.user.id }) },
      data: {
        title,
        description,
        priority,
      },
    });

    return response.status(200).json(newTask);
  }
  async delete(request: Request, response: Response) {
    const isAdmin = request.user.role === 'admin';
    const paramsSchema = z.object({
      taskId: z.uuid(),
    });
    const { taskId } = paramsSchema.parse(request.params);

    await prisma.task.delete({
      where: { id: taskId, ...(isAdmin ? {} : { user_id: request.user.id }) },
    });

    return response.status(200).json({ message: 'Deleted successfully' });
  }
  async assignUser(request: Request, response: Response) {
    const isAdmin = request.user.role === 'admin';
    const paramsSchema = z.object({
      taskId: z.uuid(),
    });
    const bodySchema = z.object({
      assignedTo: z.uuid(),
    });
    const { taskId } = paramsSchema.parse(request.params);
    const { assignedTo } = bodySchema.parse(request.body);

    const task = await prisma.task.findUniqueOrThrow({ where: { id: taskId } });

    if (!isAdmin && task.user_id !== request.user.id) {
      throw new AppError('Resource not found', 404);
    }

    await prisma.teamMember.findUniqueOrThrow({
      where: {
        user_id_team_id: { user_id: assignedTo, team_id: task.team_id },
      },
    });

    const newTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        assigned_to: { connect: { id: assignedTo } },
      },
    });
    return response.status(200).json(newTask);
  }
}

export { TaskController };
