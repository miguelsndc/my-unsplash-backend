import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

interface Payload {
  sub: string;
}

export const restricted = (req: Request, res: Response, next: NextFunction) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) return res.status(401).end();

  const [, token] = authorizationHeader.split(' ');

  if (!token) return res.status(401).end();

  try {
    const { sub } = verify(token, process.env.JWT_SECRET as string) as Payload;
    req.user_id = sub;
    next();
  } catch {
    return res.status(401).end();
  }
};
