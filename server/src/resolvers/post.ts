import { Arg, ID, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';

import { Post } from '../entities/Post';
import { CreatePostInput } from '../types/CreatePostInput';
import { PostMutationResponse } from '../types/PostMutationResponse';
import { UpdatePostInput } from '../types/UpdatePostInput';
import { checkAuth } from '../middlewares/checkAuth';

@Resolver()
export class PostResolver {
  @Mutation((_returns) => PostMutationResponse)
  @UseMiddleware(checkAuth)
  async createPost(
    @Arg('createPostInput') { title, text }: CreatePostInput
  ): Promise<PostMutationResponse> {
    try {
      const newPost = await Post.create({ title, text }).save();
      return { code: 200, success: true, message: 'Post created successfully', post: newPost };
    } catch (error) {
      console.log(error);
      return {
        code: 500,
        success: false,
        message: `Internal server error ${error.message}`,
      };
    }
  }

  @Query((_returns) => [Post], { nullable: true })
  async posts(): Promise<Post[] | null> {
    try {
      return await Post.find();
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
    @Arg('updatePostInput') { id, title, text }: UpdatePostInput
  ): Promise<PostMutationResponse> {
    const post = await Post.findOneBy({ id });
    if (!post)
      return {
        code: 400,
        success: false,
        message: 'Post not found!',
      };
    post.title = title;
    post.text = text;
    await post.save();
    return {
      code: 200,
      success: true,
      message: 'Post updated successfully',
      post,
    };
  }

  @Mutation((_returns) => PostMutationResponse)
  @UseMiddleware(checkAuth)
  async deletePost(@Arg('id', (_type) => ID) id: number): Promise<PostMutationResponse> {
    const post = await Post.findOneBy({ id });

    if (!post)
      return {
        code: 400,
        success: false,
        message: 'Post not found!',
      };
    await post.remove();

    return {
      code: 200,
      success: true,
      message: 'Post deleted successfully',
    };
  }
}
