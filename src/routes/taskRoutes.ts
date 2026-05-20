import { Router } from 'express';
import { TaskController } from '../controllers/taskController.js';
import { ensureAuthentication } from '../middlewares/ensureAuthentication.js';

const taskRoutes = Router();
const taskController = new TaskController();

taskRoutes.use(ensureAuthentication);

taskRoutes.post('/teams/:teamId', taskController.create);
taskRoutes.get('/', taskController.index);
taskRoutes.put('/:taskId', taskController.update);
taskRoutes.delete('/:taskId', taskController.delete);
taskRoutes.patch('/:taskId/assignee', taskController.assignUser);

export { taskRoutes };
