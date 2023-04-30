import { gql } from '../../__generated__';

export const loginMutation = gql(`#graphql
  mutation Login($loginInput: LoginInput!) {
    login(loginInput: $loginInput) {
     ...userMutationResponse 
    }
  }
`);
