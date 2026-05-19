import { Router } from 'express';
import { TeamController } from '../controllers/teamController.js';
import { ensureAuthentication } from '../middlewares/ensureAuthentication.js';
import { verifyUserAuthorization } from '../middlewares/verifyUserAuthorization.js';

const teamRoutes = Router();
const teamController = new TeamController();

teamRoutes.use(ensureAuthentication);
teamRoutes.use(verifyUserAuthorization(['admin']));

teamRoutes.post('/', teamController.create);
teamRoutes.get('/', teamController.index);

export { teamRoutes };
