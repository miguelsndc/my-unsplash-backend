import { Router } from 'express';
import { UserController } from './controllers/user';

const router = Router();

router.post('/users/authenticate', UserController.authenticate);

export { router };
