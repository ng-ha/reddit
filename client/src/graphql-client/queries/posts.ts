import { gql } from '../../__generated__';

export const postsQuery = gql(`#graphql
  query Posts {
    posts {
      id
      title
      text
      createdAt
      updatedAt
    }
  }
`);
