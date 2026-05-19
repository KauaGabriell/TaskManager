import { Router } from 'express';
import { TeamMemberController } from '../controllers/teamMemberController.js';
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
teamMemberRoutes.delete(
  '/:teamId/members/:userId',
  verifyUserAuthorization(['admin']),
  teamMemberController.deleteMember,
);

export { teamMemberRoutes };
