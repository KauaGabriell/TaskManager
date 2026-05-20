import { Router } from 'express';
import { sessionRoutes } from './sessionRoutes.js';
import { taskRoutes } from './taskRoutes.js';
import { teamMemberRoutes } from './teamMemberRoutes.js';
import { teamRoutes } from './teamRoutes.js';
import { userRoutes } from './userRoutes.js';

const routes = Router();

routes.use('/users', userRoutes);
routes.use('/sessions', sessionRoutes);
routes.use('/teams', teamRoutes);
routes.use('/teams', teamMemberRoutes);
routes.use('/teams', taskRoutes);

export { routes };
