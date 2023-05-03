import { gql } from '../../__generated__';

export const deletePostMutation = gql(`#graphql
  mutation DeletePost($id: ID!) {
    deletePost(id: $id) {
      ...postMutationStatuses
    }
  }

`);
