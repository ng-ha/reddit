import { gql } from '../../__generated__';

export const updatePostMutation = gql(`#graphql
  mutation UpdatePost($updatePostInput: UpdatePostInput!) {
    updatePost(updatePostInput: $updatePostInput) {
      ...postMutationResponse
    }
  }
`);
