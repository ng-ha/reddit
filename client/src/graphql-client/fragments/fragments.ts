import { gql } from '../../__generated__';

export const FRAGMENTS = gql(`#graphql
  fragment fieldError on FieldError {
    field
    message
  }
  fragment userInfo on User {
    id
    username
    email
  }
  fragment userMutationStatuses on UserMutationResponse {
    code
    success
    message
  }
  fragment userMutationResponse on UserMutationResponse {
    ...userMutationStatuses
    user {
      ...userInfo
    }
    errors {
      ...fieldError
    }
  }
  fragment postWithUserInfo on Post {
    id
    title
    text
    textSnippet
    points
    voteType
    user {
      id
      username
    }
    createdAt
    updatedAt
  }
  fragment postMutationStatuses on PostMutationResponse {
    code
    success
    message
  }
  fragment postMutationResponse on PostMutationResponse {
    ...postMutationStatuses
    post {
      ...postWithUserInfo
    }
    errors {
      ...fieldError
    }
  }
`);
