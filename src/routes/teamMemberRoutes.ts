import { Router } from 'express';
import { TeamMemberController } from '../controllers/teamMember.js';
import { ensureAuthentication } from '../middlewares/ensureAuthentication.js';
import { verifyUserAuthorization } from '../middlewares/verifyUserAuthorization.js';

const teamMemberRoutes = Router();
const teamMemberController = new TeamMemberController();

teamMemberRoutes.use(ensureAuthentication);

teamMemberRoutes.post(
  '/:teamId/members',
  verifyUserAuthorization(['admin']),
  teamMemberController.createMember,
);

export { teamMemberRoutes };
