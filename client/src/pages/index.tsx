import { NetworkStatus, useQuery } from '@apollo/client';
import { Box, Button, Flex, Heading, Link, Spinner, Stack, Text } from '@chakra-ui/react';
import NextLink from 'next/link';

import { PostsDocument } from '../__generated__/graphql';
import Layout from '../components/Layout';
import PostEditDeleteButtons from '../components/PostEditDeleteButtons';
import { postsQuery } from '../graphql-client/queries/posts';
import { addApolloState, initializeApollo } from '../lib/apolloClient';

const limit = 3;

const Index = () => {
  const { data, loading, fetchMore, networkStatus } = useQuery(postsQuery, {
    variables: { limit },
    notifyOnNetworkStatusChange: true,
    //component rendered by useQuery will be re-rendered when networkStatus changed
    //query component re-renders while a refetch is in flight (make networkStatus and loading changed)
  });
  const loadingMorePosts = networkStatus === NetworkStatus.fetchMore;
  const loadMorePosts = () => fetchMore({ variables: { cursor: data?.posts?.cursor } });

  return (
    <Layout>
      {loading && !loadingMorePosts ? (
        <Flex justifyContent="center" alignItems="center" minH="100vh">
          <Spinner />
        </Flex>
      ) : (
        <Stack spacing={8}>
          {data?.posts?.paginatedPosts.map((post) => (
            <Flex key={post.id} p={5} shadow="md" borderWidth="1px">
              <Box flex={1}>
                <NextLink href={`/post/${post.id}`} legacyBehavior>
                  <Link>
                    <Heading fontSize="xl">{post.title}</Heading>
                  </Link>
                </NextLink>
                <Text>posted by {post.user.username}</Text>
                <Flex align="center">
                  <Text mt={4}>{post.textSnippet}</Text>
                  <Box ml="auto">
                    <PostEditDeleteButtons />
                  </Box>
                </Flex>
              </Box>
            </Flex>
          ))}
        </Stack>
      )}
      {data?.posts?.hasMore && (
        <Flex>
          <Button m="auto" my="8" isLoading={loadingMorePosts} onClick={loadMorePosts}>
            {loadingMorePosts ? 'Loading...' : 'Show more'}
          </Button>
        </Flex>
      )}
    </Layout>
  );
};

export default Index;

export const getStaticProps = async () => {
  const apolloClient = initializeApollo();

  await apolloClient.query({
    query: PostsDocument,
    variables: { limit },
  });

  return addApolloState(apolloClient, {
    props: {},
  });
};
