import { gql } from '../../__generated__';

export const voteMutation = gql(`#graphql
  mutation Vote($inputVoteValue: VoteType!, $postId: Int!) {
    vote(inputVoteValue: $inputVoteValue, postId: $postId) {
      ...postMutationResponse
    }
  }
`);
