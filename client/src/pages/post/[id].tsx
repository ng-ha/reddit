import { useQuery } from '@apollo/client';
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Flex,
  Heading,
  Spinner,
} from '@chakra-ui/react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import React from 'react';

import { limit } from '..';
import {
  PostDocument,
  PostIdsDocument,
  PostIdsQuery,
  PostQuery,
} from '../../__generated__/graphql';
import Layout from '../../components/Layout';
import { postQuery } from '../../graphql-client/queries/post';
import { addApolloState, initializeApollo } from '../../lib/apolloClient';
import NextLink from 'next/link';

const Post = () => {
  const router = useRouter();
  const { loading, data, error } = useQuery(postQuery, {
    variables: { id: router.query.id as string },
  });
  if (loading)
    return (
      <Layout>
        <Flex justifyContent="center" alignItems="center" minH="100vh">
          <Spinner />
        </Flex>
      </Layout>
    );
  if (error || !data?.post)
    return (
      <Layout>
        <Alert status="error" variant="subtle">
          <AlertIcon />
          <AlertTitle>{error ? error.message : 'Post not found'}</AlertTitle>
        </Alert>
        <Flex>
          <Box mt={4} ml="auto">
            <NextLink href="/">
              <Button>Back to Homepage</Button>
            </NextLink>
          </Box>
        </Flex>
      </Layout>
    );
  return (
    <Layout>
      <Heading mb={4}>{data.post.title}</Heading>
      <Box mb={4}>{data.post.text}</Box>

      <Flex>
        <Box ml="auto">
          <NextLink href="/">
            <Button>Back to Homepage</Button>
          </NextLink>
        </Box>
      </Flex>
    </Layout>
  );
};
export const getStaticPaths: GetStaticPaths = async () => {
  const apolloClient = initializeApollo();

  const { data } = await apolloClient.query<PostIdsQuery>({
    query: PostIdsDocument, // same as postIdsQuery
    variables: { limit },
  });

  // {
  //    paths: [ {params: {slug: abc}}, {params: {slug: abc}} ],
  //    fallback: 'blocking'
  // }
  return {
    paths: data.posts!.paginatedPosts.map((post) => ({
      params: { id: `${post.id}` },
    })),
    fallback: 'blocking',
  };
};
export const getStaticProps: GetStaticProps<{ [key: string]: any }, { id: string }> = async ({
  params,
}) => {
  const apolloClient = initializeApollo();

  await apolloClient.query<PostQuery>({
    query: PostDocument, // same as postQuery
    variables: { id: params?.id },
  });
  return addApolloState(apolloClient, {
    props: {},
  });
};

export default Post;
