import axios from 'axios';
import { sign } from 'jsonwebtoken';
import { prisma } from '../prisma';

type AccessTokenResponse = {
  access_token: string;
};

type GithubUserResponse = {
  id: number;
  name: string;
  login: string;
  email: string;
  avatar_url: string;
};

export class UserService {
  static async authenticateWithGithub(code: string) {
    if (!code) throw new Error('Code is required to perform authentication.');

    const url = `https://github.com/login/oauth/access_token`;

    const { data: accessTokenResponse } = await axios.post<AccessTokenResponse>(
      url,
      null,
      {
        params: {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        },
        headers: {
          Accept: 'application/json',
        },
      }
    );

    const { data: githubUser } = await axios.get<GithubUserResponse>(
      'https://api.github.com/user',
      {
        headers: {
          Authorization: `Bearer ${accessTokenResponse.access_token}`,
        },
      }
    );

    let user = await prisma.user.findFirst({
      where: {
        githubId: githubUser.id,
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: githubUser.email,
          githubId: githubUser.id,
          photoUrl: githubUser.avatar_url,
          name: githubUser.name || githubUser.login,
        },
      });
    }

    const token = sign(
      {
        user: {
          name: user.name,
          id: user.id,
          photoUrl: user.photoUrl,
        },
      },
      process.env.JWT_SECRET as string,
      {
        subject: String(user.id),
        expiresIn: '1d',
      }
    );

    return { token, user };
  }

  static async findById(id: number) {
    if (!id) throw new Error('Id is required to find the user.');

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    return user;
  }
}
