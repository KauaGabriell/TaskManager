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

  async index(request: Request, response: Response) {
    const paramsSchema = z.object({
      teamId: z.uuid(),
    });
    const { teamId } = paramsSchema.parse(request.params);

    const membersTeam = await prisma.team.findUnique({
      where: { id: teamId },
      select: {
        id: true,
        name: true,
        teamMember: {
          select: {
            user: { select: { id: true, name: true, email: true, role: true } },
          },
        },
      },
    });
    if (!membersTeam) throw new AppError('Resource Not Found', 404);

    const users = membersTeam?.teamMember.map((member) => member.user);
    const teamWithMembers = {
      team: {
        id: membersTeam.id,
        name: membersTeam?.name,
      },
      users,
    };
    return response.status(200).json(teamWithMembers);
  }
}

export { TeamMemberController };
