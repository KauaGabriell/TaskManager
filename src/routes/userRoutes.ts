import { Router } from 'express';
import { UserController } from '../controllers/userController.js';

const userRoutes = Router();
const userController = new UserController();

userRoutes.post('/', userController.create);
userRoutes.get('/', userController.index);

export { userRoutes };
