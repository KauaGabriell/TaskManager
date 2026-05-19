import { Router } from 'express';
import { TeamMemberController } from '../controllers/teamMemberController.js';
import { ensureAuthentication } from '../middlewares/ensureAuthentication.js';
import { verifyUserAuthorization } from '../middlewares/verifyUserAuthorization.js';

const teamMemberRoutes = Router();
const teamMemberController = new TeamMemberController();

teamMemberRoutes.use(ensureAuthentication);

teamMemberRoutes.post(
  /*Add Member*/
  '/:teamId/members',
  verifyUserAuthorization(['admin']),
  teamMemberController.createMember,
);
teamMemberRoutes.delete(
  /*Delete Member from Team*/
  '/:teamId/members/:userId',
  verifyUserAuthorization(['admin']),
  teamMemberController.deleteMember,
);
teamMemberRoutes.get(
  /*List Members*/
  '/:teamId/members',
  verifyUserAuthorization(['admin', 'member']),
  teamMemberController.index,
);

export { teamMemberRoutes };
