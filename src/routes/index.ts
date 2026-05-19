import { Router } from 'express';
import { sessionRoutes } from './sessionRoutes.js';
import { teamMemberRoutes } from './teamMemberRoutes.js';
import { teamRoutes } from './teamRoutes.js';
import { userRoutes } from './userRoutes.js';

const routes = Router();

routes.use('/users', userRoutes);
routes.use('/sessions', sessionRoutes);
routes.use('/teams', teamRoutes);
routes.use('/teams', teamMemberRoutes);

export { routes };
