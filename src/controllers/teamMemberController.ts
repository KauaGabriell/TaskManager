import type { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../libs/prisma.js';

class TeamMemberController {
  async createMember(request: Request, response: Response) {
    const paramsSchema = z.object({ teamId: z.uuid() });
    const bodySchema = z.object({ userId: z.uuid() });

    const { teamId } = paramsSchema.parse(request.params);
    const { userId } = bodySchema.parse(request.body);

    const member = await prisma.teamMember.create({
      data: {
        user_id: userId,
        team_id: teamId,
      },
    });
    return response.status(201).json(member);
  }

  async deleteMember(request: Request, response: Response) {
    const paramsSchema = z.object({
      teamId: z.uuid(),
      userId: z.uuid(),
    });

    const { userId, teamId } = paramsSchema.parse(request.params);

    await prisma.teamMember.delete({
      where: {
        user_id_team_id: {
          user_id: userId,
          team_id: teamId,
        },
      },
    });

    return response.status(200).json({ message: 'Deleted successfully' });
  }
}

export { TeamMemberController };
