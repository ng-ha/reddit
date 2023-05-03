import { useMutation, useQuery } from '@apollo/client';
import { Box, Button, Flex, Heading, Link, Spinner, useToast } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

import { MeDocument, MeQuery } from '../__generated__/graphql';
import { logoutMutation } from '../graphql-client/mutations/logout';
import { meQuery } from '../graphql-client/queries/me';

const Navbar = () => {
  const { loading: meQueryLoading, data } = useQuery(meQuery);
  const [logout, { loading: logoutMutationLoading }] = useMutation(logoutMutation);
  const toast = useToast();

  const logoutUser = async () => {
    const response = await logout({
      update: (cache, { data }) => {
        if (data?.logout) {
          cache.writeQuery<MeQuery>({
            query: MeDocument,
            data: { me: null },
          });
        }
      },
    });

    if (response.data?.logout) {
      toast({
        title: `Logged out successfully!`,
        description: "Now you're restricted from using all the features.",
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  let body;
  if (meQueryLoading) {
    body = <Spinner mr={20} />;
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login" legacyBehavior>
          <Link mr={2}>Login</Link>
        </NextLink>
        <NextLink href="/register" legacyBehavior>
          <Link>Register</Link>
        </NextLink>
      </>
    );
  } else {
    body = (
      <Flex>
        <NextLink href="/create-post">
          <Button mr={4}>Create Post</Button>
        </NextLink>
        <Button onClick={logoutUser} isLoading={logoutMutationLoading}>
          Logout
        </Button>
      </Flex>
    );
  }

  return (
    <Box bg="tan" p={4}>
      <Flex maxW={800} justifyContent="space-between" align="center" m="auto">
        <NextLink href="/">
          <Heading>Reddit</Heading>
        </NextLink>
        <Box>{body}</Box>
      </Flex>
    </Box>
  );
};

export default Navbar;
