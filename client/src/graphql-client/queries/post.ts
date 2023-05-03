import { gql } from '../../__generated__';

export const postQuery = gql(`#graphql
  query Post($id: ID!) {
    post(id: $id) {
      id
      title
      text
      userId
    }
  }
`);
