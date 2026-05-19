import type { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../libs/prisma.js';
import { AppError } from '../utils/AppError.js';

class TeamMemberController {
  async createMember(request: Request, response: Response) {
    const paramsSchema = z.object({ teamId: z.uuid() });
    const bodySchema = z.object({ userId: z.uuid() });

    const { teamId } = paramsSchema.parse(request.params);
    const { userId } = bodySchema.parse(request.body);

    const user = await prisma.user.findFirst({ where: { id: userId } });
    const team = await prisma.team.findFirst({ where: { id: teamId } });
    if (userId !== user?.id) throw new AppError('User Not Found', 404);
    if (teamId !== team?.id) throw new AppError('Team Not Found', 401);

    const member = await prisma.teamMember.create({
      data: {
        user_id: userId,
        team_id: teamId,
      },
    });
    return response.status(201).json(member);
  }
}

export { TeamMemberController };
