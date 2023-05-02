import { gql } from '../../__generated__';

export const postsQuery = gql(`#graphql
  query Posts($limit: Int!, $cursor: String) {
  posts(limit: $limit, cursor: $cursor) {
    totalCount
    cursor
    hasMore
    paginatedPosts {
      id
      title
      text
      textSnippet
      user {
        username
      }
      createdAt
      updatedAt
    }
  }
}
`);
