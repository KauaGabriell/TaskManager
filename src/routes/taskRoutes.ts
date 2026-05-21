import { Router } from 'express';
import { TaskController } from '../controllers/taskController.js';
import { ensureAuthentication } from '../middlewares/ensureAuthentication.js';
import { verifyUserAuthorization } from '../middlewares/verifyUserAuthorization.js';

const taskRoutes = Router();
const taskController = new TaskController();

taskRoutes.use(ensureAuthentication);
taskRoutes.use(verifyUserAuthorization(['admin', 'member']));

taskRoutes.post('/teams/:teamId', taskController.create);
taskRoutes.get('/', taskController.index);
taskRoutes.put('/:taskId', taskController.update);
taskRoutes.delete('/:taskId', taskController.delete);
taskRoutes.patch('/:taskId/assignee', taskController.assignUser);
taskRoutes.patch('/:taskId/status', taskController.updateStatus);
taskRoutes.get('/:taskId/logs', taskController.viewUpdateStatusLogs);

export { taskRoutes };
