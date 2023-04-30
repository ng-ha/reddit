import { gql } from '../../__generated__';

export const registerMutation = gql(`#graphql
  mutation Register($registerInput: RegisterInput!) {
    register(registerInput: $registerInput) {
     ...userMutationResponse 
    }
  }
`);
