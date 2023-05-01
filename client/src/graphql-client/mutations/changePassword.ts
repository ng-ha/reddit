import { gql } from '../../__generated__';

export const changePasswordMutation = gql(`#graphql
  mutation ChangePassword($changePasswordInput: ChangePasswordInput!, $userId: String!, $token: String!) {
    changePassword(changePasswordInput: $changePasswordInput, userId: $userId, token: $token) {
     ...userMutationResponse 
    }
  }
`);
