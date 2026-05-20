import { Router } from 'express';
import { TaskController } from '../controllers/taskController.js';
import { ensureAuthentication } from '../middlewares/ensureAuthentication.js';

const taskRoutes = Router();
const taskController = new TaskController();

taskRoutes.use(ensureAuthentication);

taskRoutes.post('/:teamId/tasks', taskController.create);

export { taskRoutes };
