/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "#graphql\n  fragment fieldError on FieldError {\n    field\n    message\n  }\n  fragment userInfo on User {\n    id\n    username\n    email\n  }\n  fragment userMutationStatuses on UserMutationResponse {\n    code\n    success\n    message\n  }\n  fragment userMutationResponse on UserMutationResponse {\n    ...userMutationStatuses\n    user {\n      ...userInfo\n    }\n    errors {\n      ...fieldError\n    }\n  }\n  fragment postWithUserInfo on Post {\n    id\n    title\n    text\n    textSnippet\n    points\n    voteType\n    user {\n      id\n      username\n    }\n    createdAt\n    updatedAt\n  }\n  fragment postMutationStatuses on PostMutationResponse {\n    code\n    success\n    message\n  }\n  fragment postMutationResponse on PostMutationResponse {\n    ...postMutationStatuses\n    post {\n      ...postWithUserInfo\n    }\n    errors {\n      ...fieldError\n    }\n  }\n": types.FieldErrorFragmentDoc,
    "#graphql\n  mutation ChangePassword($changePasswordInput: ChangePasswordInput!, $userId: String!, $token: String!) {\n    changePassword(changePasswordInput: $changePasswordInput, userId: $userId, token: $token) {\n     ...userMutationResponse \n    }\n  }\n": types.ChangePasswordDocument,
    "#graphql\n  mutation CreatePost($createPostInput: CreatePostInput!) {\n    createPost(createPostInput: $createPostInput) {\n      ...postMutationResponse\n    }\n  }\n": types.CreatePostDocument,
    "#graphql\n  mutation DeletePost($id: ID!) {\n    deletePost(id: $id) {\n      ...postMutationStatuses\n    }\n  }\n\n": types.DeletePostDocument,
    "#graphql\n  mutation ForgotPassword($forgotPasswordInput: ForgotPasswordInput!) {\n    forgotPassword(forgotPasswordInput: $forgotPasswordInput)\n  }\n": types.ForgotPasswordDocument,
    "#graphql\n  mutation Login($loginInput: LoginInput!) {\n    login(loginInput: $loginInput) {\n     ...userMutationResponse \n    }\n  }\n": types.LoginDocument,
    "#graphql\n  mutation Logout {\n    logout \n  }\n": types.LogoutDocument,
    "#graphql\n  mutation Register($registerInput: RegisterInput!) {\n    register(registerInput: $registerInput) {\n     ...userMutationResponse \n    }\n  }\n": types.RegisterDocument,
    "#graphql\n  mutation UpdatePost($updatePostInput: UpdatePostInput!) {\n    updatePost(updatePostInput: $updatePostInput) {\n      ...postMutationResponse\n    }\n  }\n": types.UpdatePostDocument,
    "#graphql\n  mutation Vote($inputVoteValue: VoteType!, $postId: Int!) {\n    vote(inputVoteValue: $inputVoteValue, postId: $postId) {\n      ...postMutationResponse\n    }\n  }\n": types.VoteDocument,
    "#graphql\n  query Me {\n    me {\n      ...userInfo\n    }\n  }\n": types.MeDocument,
    "#graphql\n  query Post($id: ID!) {\n    post(id: $id) {\n      id\n      title\n      text\n      userId\n    }\n  }\n": types.PostDocument,
    "#graphql\n  query PostIds($limit: Int!, $cursor: String) {\n    posts(limit: $limit, cursor: $cursor) {\n      paginatedPosts {\n        id\n      }\n    }\n  }\n\n": types.PostIdsDocument,
    "#graphql\n  query Posts($limit: Int!, $cursor: String) {\n  posts(limit: $limit, cursor: $cursor) {\n    totalCount\n    cursor\n    hasMore\n    paginatedPosts {\n      ...postWithUserInfo\n    }\n  }\n}\n": types.PostsDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "#graphql\n  fragment fieldError on FieldError {\n    field\n    message\n  }\n  fragment userInfo on User {\n    id\n    username\n    email\n  }\n  fragment userMutationStatuses on UserMutationResponse {\n    code\n    success\n    message\n  }\n  fragment userMutationResponse on UserMutationResponse {\n    ...userMutationStatuses\n    user {\n      ...userInfo\n    }\n    errors {\n      ...fieldError\n    }\n  }\n  fragment postWithUserInfo on Post {\n    id\n    title\n    text\n    textSnippet\n    points\n    voteType\n    user {\n      id\n      username\n    }\n    createdAt\n    updatedAt\n  }\n  fragment postMutationStatuses on PostMutationResponse {\n    code\n    success\n    message\n  }\n  fragment postMutationResponse on PostMutationResponse {\n    ...postMutationStatuses\n    post {\n      ...postWithUserInfo\n    }\n    errors {\n      ...fieldError\n    }\n  }\n"): (typeof documents)["#graphql\n  fragment fieldError on FieldError {\n    field\n    message\n  }\n  fragment userInfo on User {\n    id\n    username\n    email\n  }\n  fragment userMutationStatuses on UserMutationResponse {\n    code\n    success\n    message\n  }\n  fragment userMutationResponse on UserMutationResponse {\n    ...userMutationStatuses\n    user {\n      ...userInfo\n    }\n    errors {\n      ...fieldError\n    }\n  }\n  fragment postWithUserInfo on Post {\n    id\n    title\n    text\n    textSnippet\n    points\n    voteType\n    user {\n      id\n      username\n    }\n    createdAt\n    updatedAt\n  }\n  fragment postMutationStatuses on PostMutationResponse {\n    code\n    success\n    message\n  }\n  fragment postMutationResponse on PostMutationResponse {\n    ...postMutationStatuses\n    post {\n      ...postWithUserInfo\n    }\n    errors {\n      ...fieldError\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "#graphql\n  mutation ChangePassword($changePasswordInput: ChangePasswordInput!, $userId: String!, $token: String!) {\n    changePassword(changePasswordInput: $changePasswordInput, userId: $userId, token: $token) {\n     ...userMutationResponse \n    }\n  }\n"): (typeof documents)["#graphql\n  mutation ChangePassword($changePasswordInput: ChangePasswordInput!, $userId: String!, $token: String!) {\n    changePassword(changePasswordInput: $changePasswordInput, userId: $userId, token: $token) {\n     ...userMutationResponse \n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "#graphql\n  mutation CreatePost($createPostInput: CreatePostInput!) {\n    createPost(createPostInput: $createPostInput) {\n      ...postMutationResponse\n    }\n  }\n"): (typeof documents)["#graphql\n  mutation CreatePost($createPostInput: CreatePostInput!) {\n    createPost(createPostInput: $createPostInput) {\n      ...postMutationResponse\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "#graphql\n  mutation DeletePost($id: ID!) {\n    deletePost(id: $id) {\n      ...postMutationStatuses\n    }\n  }\n\n"): (typeof documents)["#graphql\n  mutation DeletePost($id: ID!) {\n    deletePost(id: $id) {\n      ...postMutationStatuses\n    }\n  }\n\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "#graphql\n  mutation ForgotPassword($forgotPasswordInput: ForgotPasswordInput!) {\n    forgotPassword(forgotPasswordInput: $forgotPasswordInput)\n  }\n"): (typeof documents)["#graphql\n  mutation ForgotPassword($forgotPasswordInput: ForgotPasswordInput!) {\n    forgotPassword(forgotPasswordInput: $forgotPasswordInput)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "#graphql\n  mutation Login($loginInput: LoginInput!) {\n    login(loginInput: $loginInput) {\n     ...userMutationResponse \n    }\n  }\n"): (typeof documents)["#graphql\n  mutation Login($loginInput: LoginInput!) {\n    login(loginInput: $loginInput) {\n     ...userMutationResponse \n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "#graphql\n  mutation Logout {\n    logout \n  }\n"): (typeof documents)["#graphql\n  mutation Logout {\n    logout \n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "#graphql\n  mutation Register($registerInput: RegisterInput!) {\n    register(registerInput: $registerInput) {\n     ...userMutationResponse \n    }\n  }\n"): (typeof documents)["#graphql\n  mutation Register($registerInput: RegisterInput!) {\n    register(registerInput: $registerInput) {\n     ...userMutationResponse \n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "#graphql\n  mutation UpdatePost($updatePostInput: UpdatePostInput!) {\n    updatePost(updatePostInput: $updatePostInput) {\n      ...postMutationResponse\n    }\n  }\n"): (typeof documents)["#graphql\n  mutation UpdatePost($updatePostInput: UpdatePostInput!) {\n    updatePost(updatePostInput: $updatePostInput) {\n      ...postMutationResponse\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "#graphql\n  mutation Vote($inputVoteValue: VoteType!, $postId: Int!) {\n    vote(inputVoteValue: $inputVoteValue, postId: $postId) {\n      ...postMutationResponse\n    }\n  }\n"): (typeof documents)["#graphql\n  mutation Vote($inputVoteValue: VoteType!, $postId: Int!) {\n    vote(inputVoteValue: $inputVoteValue, postId: $postId) {\n      ...postMutationResponse\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "#graphql\n  query Me {\n    me {\n      ...userInfo\n    }\n  }\n"): (typeof documents)["#graphql\n  query Me {\n    me {\n      ...userInfo\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "#graphql\n  query Post($id: ID!) {\n    post(id: $id) {\n      id\n      title\n      text\n      userId\n    }\n  }\n"): (typeof documents)["#graphql\n  query Post($id: ID!) {\n    post(id: $id) {\n      id\n      title\n      text\n      userId\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "#graphql\n  query PostIds($limit: Int!, $cursor: String) {\n    posts(limit: $limit, cursor: $cursor) {\n      paginatedPosts {\n        id\n      }\n    }\n  }\n\n"): (typeof documents)["#graphql\n  query PostIds($limit: Int!, $cursor: String) {\n    posts(limit: $limit, cursor: $cursor) {\n      paginatedPosts {\n        id\n      }\n    }\n  }\n\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "#graphql\n  query Posts($limit: Int!, $cursor: String) {\n  posts(limit: $limit, cursor: $cursor) {\n    totalCount\n    cursor\n    hasMore\n    paginatedPosts {\n      ...postWithUserInfo\n    }\n  }\n}\n"): (typeof documents)["#graphql\n  query Posts($limit: Int!, $cursor: String) {\n  posts(limit: $limit, cursor: $cursor) {\n    totalCount\n    cursor\n    hasMore\n    paginatedPosts {\n      ...postWithUserInfo\n    }\n  }\n}\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;