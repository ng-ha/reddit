import {
  Arg,
  Ctx,
  FieldResolver,
  ID,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from 'type-graphql';

import { LessThan } from 'typeorm';
import { Post } from '../entities/Post';
import { User } from '../entities/User';
import { checkAuth } from '../middlewares/checkAuth';
import { Context } from '../types/Context';
import { CreatePostInput } from '../types/CreatePostInput';
import { PaginatedPosts } from '../types/PaginatedPosts';
import { PostMutationResponse } from '../types/PostMutationResponse';
import { UpdatePostInput } from '../types/UpdatePostInput';

@Resolver((_of) => Post)
export class PostResolver {
  @FieldResolver((_returns) => String)
  textSnippet(@Root() root: Post) {
    return root.text.slice(0, 50);
  }

  @FieldResolver((_returns) => User)
  async user(@Root() root: Post) {
    return await User.findOneBy({ id: root.userId });
  }

  @Mutation((_returns) => PostMutationResponse)
  @UseMiddleware(checkAuth)
  async createPost(
    @Arg('createPostInput') { title, text }: CreatePostInput,
    @Ctx() { req }: Context
  ): Promise<PostMutationResponse> {
    try {
      const newPost = await Post.create({ title, text, userId: req.session.userId }).save();
      return { code: 200, success: true, message: 'Post created successfully', post: newPost };
    } catch (error) {
      console.log(error);
      return { code: 500, success: false, message: `Internal server error ${error.message}` };
    }
  }

  @Query((_returns) => PaginatedPosts, { nullable: true })
  async posts(
    @Arg('limit', (_type) => Int) limit: number,
    @Arg('cursor', { nullable: true }) cursor?: string
  ): Promise<PaginatedPosts | null> {
    try {
      const totalCount = await Post.count();
      const realLimit = Math.min(10, limit);

      const findOptions: { [key: string]: any } = {
        order: { createdAt: 'DESC' },
        take: realLimit,
      };
      let oldestPostInDb: Post[] = [];
      if (cursor) {
        findOptions.where = { createdAt: LessThan(cursor) };
        oldestPostInDb = await Post.find({ order: { createdAt: 'ASC' }, take: 1 });
      }
      const posts = await Post.find(findOptions);
      const oldestPostPaginated = posts[posts.length - 1];

      return {
        totalCount,
        cursor: oldestPostPaginated.createdAt,
        hasMore: cursor
          ? oldestPostPaginated.createdAt.toString() !== oldestPostInDb[0].createdAt.toString()
          : posts.length !== totalCount,
        paginatedPosts: posts,
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  @Query((_returns) => Post, { nullable: true })
  async post(@Arg('id', (_type) => ID) id: number): Promise<Post | null> {
    try {
      return await Post.findOneBy({ id });
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  @Mutation((_returns) => PostMutationResponse)
  @UseMiddleware(checkAuth)
  async updatePost(
    @Arg('updatePostInput') { id, title, text }: UpdatePostInput,
    @Ctx() { req }: Context
  ): Promise<PostMutationResponse> {
    const post = await Post.findOneBy({ id });
    if (!post) return { code: 400, success: false, message: 'Post not found' };
    if (post.userId !== req.session.userId) {
      return { code: 401, success: false, message: 'Unauthorized' };
    }
    post.title = title;
    post.text = text;
    await post.save();
    return { code: 200, success: true, message: 'Post updated successfully', post };
  }

  @Mutation((_returns) => PostMutationResponse)
  @UseMiddleware(checkAuth)
  async deletePost(
    @Arg('id', (_type) => ID) id: number,
    @Ctx() { req }: Context
  ): Promise<PostMutationResponse> {
    const post = await Post.findOneBy({ id });

    if (!post) return { code: 400, success: false, message: 'Post not found!' };

    if (post.userId !== req.session.userId) {
      return { code: 401, success: false, message: 'Unauthorized' };
    }
    await post.remove();

    return { code: 200, success: true, message: 'Post deleted successfully' };
  }
}
