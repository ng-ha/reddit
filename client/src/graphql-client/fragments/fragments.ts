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
  fragment mutationStatuses on UserMutationResponse {
    code
    success
    message
  }
  fragment userMutationResponse on UserMutationResponse {
    ...mutationStatuses
    user {
      ...userInfo
    }
    errors {
      ...fieldError
    }
  }
`);
