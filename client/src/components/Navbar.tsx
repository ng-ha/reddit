import { useMutation, useQuery } from '@apollo/client';
import { Box, Button, Flex, Heading, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

import { MeDocument, MeQuery } from '../__generated__/graphql';
import { logoutMutation } from '../graphql-client/mutations/logout';
import { meQuery } from '../graphql-client/queries/me';

const Navbar = () => {
  const { loading: meQueryLoading, data } = useQuery(meQuery);
  const [logout, { loading: logoutMutationLoading }] = useMutation(logoutMutation);

  const logoutUser = async () => {
    await logout({
      update: (cache, { data }) => {
        if (data?.logout) {
          cache.writeQuery<MeQuery>({
            query: MeDocument,
            data: { me: null },
          });
        }
      },
    });
  };

  let body;
  if (meQueryLoading) {
    body = null;
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          <Link mr={2} as="span">
            Login
          </Link>
        </NextLink>
        <NextLink href="/register">
          <Link as="span">Register</Link>
        </NextLink>
      </>
    );
  } else {
    body = (
      <Button onClick={logoutUser} isLoading={logoutMutationLoading}>
        Logout
      </Button>
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
