import { gql } from '../../__generated__';

export const forgotPasswordMutation = gql(`#graphql
  mutation ForgotPassword($forgotPasswordInput: ForgotPasswordInput!) {
    forgotPassword(forgotPasswordInput: $forgotPasswordInput)
  }
`);
