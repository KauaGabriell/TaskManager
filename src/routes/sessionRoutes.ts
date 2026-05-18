import { Router } from 'express';
import { SessionController } from '../controllers/sessionController.js';

const sessionRoutes = Router();
const sessionController = new SessionController();

sessionRoutes.post('/', sessionController.login);

export { sessionRoutes };
