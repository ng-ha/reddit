import { gql } from '../../__generated__';

export const createPostMutation = gql(`#graphql
  mutation CreatePost($createPostInput: CreatePostInput!) {
    createPost(createPostInput: $createPostInput) {
      code
      success
      message
      post {
        ...postWithUserInfo
      }
      errors {
        ...fieldError
      }
    }
  }
`);
