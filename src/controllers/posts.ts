import { Request, Response } from 'express';
import { PostsService } from '../services/posts';

export class PostsController {
  static async create(req: Request, res: Response) {
    const id = req.user_id;
    const { label, url } = req.body;

    const result = await PostsService.createPost({ id, label, url });

    return res.json(result);
  }

  static async findPostsFromUser(req: Request, res: Response) {
    const id = req.params.id;

    const result = await PostsService.findPostsFromUser(id);

    return res.json(result);
  }

  static async findMany(req: Request, res: Response) {
    const result = await PostsService.findMany();

    res.json(result);
  }

  static async deleteOne(req: Request, res: Response) {
    const id = Number(req.params.id);
    const userId = Number(req.user_id);

    const result = await PostsService.delete(id, userId);

    return res.json(result);
  }

  static async findByLabel(req: Request, res: Response) {
    const label = String(req.query.q);

    const result = await PostsService.findByLabel(label);

    return res.json(result);
  }
}
