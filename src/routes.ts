import { Router } from 'express';
import { PostsController } from './controllers/posts';
import { UserController } from './controllers/user';
import { restricted } from './middlewares/restricted';

const router = Router();

router.post('/users/authenticate', UserController.authenticate);
router.get('/users/:id/posts', restricted, PostsController.findPostsFromUser);
router.get('/users/profile', restricted, UserController.findUserById);
router.post('/posts', restricted, PostsController.create);
router.get('/posts', PostsController.findMany);
router.delete('/posts/:id', restricted, PostsController.deleteOne);
router.get('/posts/search', PostsController.findByLabel);

export { router };
