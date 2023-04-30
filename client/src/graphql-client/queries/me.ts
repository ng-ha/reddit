import { gql } from '../../__generated__';

export const meQuery = gql(`#graphql
  query Me {
    me {
      ...userInfo
    }
  }
`);
