import { Request, Response } from 'express';
import { UserService } from '../services/user';

export class UserController {
  static async authenticate(req: Request, res: Response) {
    const code = req.body.code;

    const result = await UserService.authenticateWithGithub(code);
    return res.json(result);
  }
}
