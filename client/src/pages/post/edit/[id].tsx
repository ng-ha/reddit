import { useQuery } from '@apollo/client';
import { Alert, AlertIcon, AlertTitle, Box, Button, Flex, Spinner } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import Layout from '../../../components/Layout';
import { meQuery } from '../../../graphql-client/queries/me';
import { postQuery } from '../../../graphql-client/queries/post';

const PostEdit = () => {
  const router = useRouter();
  const { data: meData, loading: meLoading } = useQuery(meQuery);
  const {
    data: postData,
    loading: postLoading,
    error,
  } = useQuery(postQuery, {
    variables: { id: router.query.id as string },
  });
  if (meLoading || postLoading)
    return (
      <Layout>
        <Flex justifyContent="center" alignItems="center" minH="100vh">
          <Spinner />
        </Flex>
      </Layout>
    );

  if (!meData?.me || meData?.me?.id !== postData?.post?.userId.toString())
    return (
      <Layout>
        <Alert status="error" variant="subtle">
          <AlertIcon />
          <AlertTitle>You're not authorized to perfome this action!</AlertTitle>
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

  return <div>PostEdit</div>;
};

export default PostEdit;
