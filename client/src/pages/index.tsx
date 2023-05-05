import { NetworkStatus, useQuery } from '@apollo/client';
import { Box, Button, Flex, Heading, Link, Spinner, Stack, Text } from '@chakra-ui/react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import NextLink from 'next/link';

import { PostsDocument, PostsQuery } from '../__generated__/graphql';
import Layout from '../components/Layout';
import PostEditDeleteButtons from '../components/PostEditDeleteButtons';
import UpvoteSection from '../components/UpvoteSection';
import { meQuery } from '../graphql-client/queries/me';
import { postsQuery } from '../graphql-client/queries/posts';
import { addApolloState, initializeApollo } from '../lib/apolloClient';

export const limit = 3;

const Index = () => {
  const { data: meData, loading: meLoading } = useQuery(meQuery);
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
                <Text fontStyle="italic" fontSize={13}>
                  posted by {post.user.username}
                </Text>
                <Text mt={4}>{post.textSnippet}</Text>
                <Flex align="center" mt={3}>
                  <UpvoteSection post={post} />
                  <Box ml="auto">
                    <PostEditDeleteButtons postId={post.id} postUserId={post.user.id} />
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

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const Cookie = context.req.headers.cookie;
  const apolloClient = initializeApollo();

  await apolloClient.query<PostsQuery>({
    query: PostsDocument, // same as postsQuery
    variables: { limit },
    context: { headers: { Cookie } },
  });

  return addApolloState(apolloClient, {
    props: {},
  });
};
