import { Request, Response } from 'express';
import { UserService } from '../services/user';

export class UserController {
  static async authenticate(req: Request, res: Response) {
    const code = req.body.code;

    const result = await UserService.authenticateWithGithub(code);
    return res.json(result);
  }

  static async findUserById(req: Request, res: Response) {
    const userId = Number(req.user_id);

    const result = await UserService.findById(userId);

    return res.json(result);
  }
}
