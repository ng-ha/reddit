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
  registerEnumType,
} from 'type-graphql';
import { LessThan } from 'typeorm';
import { GraphQLError } from 'graphql';

import { Post } from '../entities/Post';
import { Upvote } from '../entities/Upvote';
import { User } from '../entities/User';
import { checkAuth } from '../middlewares/checkAuth';
import { Context } from '../types/Context';
import { CreatePostInput } from '../types/CreatePostInput';
import { PaginatedPosts } from '../types/PaginatedPosts';
import { PostMutationResponse } from '../types/PostMutationResponse';
import { UpdatePostInput } from '../types/UpdatePostInput';
import { VoteType } from '../types/VoteType';

registerEnumType(VoteType, { name: 'VoteType' });

@Resolver((_of) => Post)
export class PostResolver {
  @FieldResolver((_returns) => String)
  textSnippet(@Root() root: Post): string {
    return root.text.slice(0, 70) + '...';
  }

  @FieldResolver((_returns) => User)
  async user(
    @Root() root: Post,
    @Ctx() { dataLoaders: { userLoader } }: Context
  ): Promise<User | undefined> {
    // return await User.findOneBy({ id: root.userId }); // not performant
    return await userLoader.load(root.userId);
  }

  @FieldResolver((_returns) => Int)
  async voteType(
    @Root() root: Post,
    @Ctx() { req, dataLoaders: { voteTypeLoaders } }: Context
  ): Promise<number> {
    if (!req.session.userId) return 0;
    // const existingVote = await Upvote.findOneBy({ postId: root.id, userId: req.session.userId }); // not performant
    const existingVote = await voteTypeLoaders.load({
      postId: root.id,
      userId: req.session.userId,
    });
    return existingVote ? existingVote.value : 0;
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
    await Upvote.delete({ postId: id });
    await post.remove();

    return { code: 200, success: true, message: 'Post deleted successfully' };
  }

  @Mutation((_returns) => PostMutationResponse)
  @UseMiddleware(checkAuth)
  async vote(
    @Arg('postId', (_type) => Int) postId: number,
    @Arg('inputVoteValue', (_type) => VoteType) inputVoteValue: VoteType,
    @Ctx() { req, AppDataSource }: Context
  ): Promise<PostMutationResponse> {
    return await AppDataSource.transaction(async (transactionalEntityManager) => {
      //check if post exists
      let post = await transactionalEntityManager.findOneBy(Post, { id: postId });
      if (!post) {
        throw new GraphQLError('Post not found', { extensions: { code: 'BAD_USER_INPUT' } });
      }
      //check if user has voted or not
      const existingVote = await transactionalEntityManager.findOneBy(Upvote, {
        postId,
        userId: req.session.userId,
      });

      if (existingVote && existingVote.value !== inputVoteValue) {
        await transactionalEntityManager.save(Upvote, {
          ...existingVote,
          value: inputVoteValue,
        });
        post = await transactionalEntityManager.save(Post, {
          ...post,
          points: post.points + 2 * inputVoteValue,
        });
      }

      if (!existingVote) {
        const newVote = transactionalEntityManager.create(Upvote, {
          value: inputVoteValue,
          userId: req.session.userId,
          postId,
        });
        await transactionalEntityManager.save(newVote);
        post.points = post.points + inputVoteValue;
        post = await transactionalEntityManager.save(post);
      }

      return { code: 200, success: true, message: 'Post voted successfully', post };
    });
  }
}
