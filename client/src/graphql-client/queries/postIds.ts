import { gql } from '../../__generated__';

export const postIdsQuery = gql(`#graphql
  query PostIds($limit: Int!, $cursor: String) {
    posts(limit: $limit, cursor: $cursor) {
      paginatedPosts {
        id
      }
    }
  }

`);
