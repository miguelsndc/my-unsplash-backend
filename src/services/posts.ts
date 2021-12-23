import { prisma } from '../prisma';

interface CreatePostParams {
  label: string;
  url: string;
  id: string;
}

export class PostsService {
  static async createPost({ label, url, id }: CreatePostParams) {
    if (!label.trim() || !url.trim())
      throw new Error('Post and label are required.');

    const newPost = await prisma.post.create({
      data: {
        label,
        url,
        userId: Number(id),
      },
    });

    return newPost;
  }

  static async findPostsFromUser(id: string) {
    if (!id) throw new Error('Id is required to perform operations.');

    const posts = await prisma.post.findMany({
      where: {
        userId: Number(id),
      },
    });

    return posts;
  }

  static async findMany(page: number = 1) {
    const amountOfRecords = 10;
    const recordsToSkip = (page = 1 ? 0 : page - 1 * amountOfRecords);

    const posts = await prisma.post.findMany({
      skip: recordsToSkip,
      take: amountOfRecords,
    });

    return posts;
  }

  static async delete(id: number, userId: number) {
    const postToBeDeleted = await prisma.post.findUnique({
      where: {
        id,
      },
    });

    if (postToBeDeleted?.userId !== userId)
      throw new Error('Users can only delete their own posts.');

    const deletePost = await prisma.post.delete({
      where: {
        id: postToBeDeleted.id,
      },
    });

    return {
      message: 'Post deleted successfully',
      deletedPost: deletePost,
    };
  }

  static async findByLabel(query: string) {
    const matchingPosts = await prisma.post.findMany({
      where: {
        label: {
          contains: query,
        },
      },
      take: 20,
    });

    return matchingPosts;
  }
}
