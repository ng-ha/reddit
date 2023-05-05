import { Reference, gql, useMutation, useQuery } from '@apollo/client';
import { Box, Button, Flex, Heading, Spinner, Text, useToast } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import { MoonIcon } from '@chakra-ui/icons';

import { MeDocument, MeQuery } from '../__generated__/graphql';
import { logoutMutation } from '../graphql-client/mutations/logout';
import { meQuery } from '../graphql-client/queries/me';

const Navbar = () => {
  const { loading: meQueryLoading, data, error } = useQuery(meQuery);
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
          cache.modify({
            fields: {
              posts: (existing) => {
                existing.paginatedPosts.forEach((post: Reference) => {
                  cache.writeFragment({
                    id: post.__ref, // "Post:17"
                    fragment: gql`
                      fragment VoteType on Post {
                        voteType
                      }
                    `,
                    data: { voteType: 0 },
                  });
                });
                return existing;
              },
            },
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
    body = <Spinner mr={20} color="white" />;
  } else if (error) {
    body = error.message;
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login" legacyBehavior>
          <Button mr={4}>Login</Button>
        </NextLink>
        <NextLink href="/register" legacyBehavior>
          <Button>Register</Button>
        </NextLink>
      </>
    );
  } else {
    body = (
      <Flex alignItems="center">
        <Text mr={4} color="white" fontWeight="bold" fontSize={15} fontStyle="italic">
          Greeting, {data.me.username}!
        </Text>
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
    <Box bg="#11B356" p={2}>
      <Flex maxW={800} justifyContent="space-between" align="center" m="auto">
        <NextLink href="/">
          <Heading color="white" position="relative">
            Reddit{' '}
            <Box position="absolute" top={-1} right={-10}>
              <MoonIcon alignSelf="flex-start" />
            </Box>
          </Heading>
        </NextLink>
        <Box>{body}</Box>
      </Flex>
    </Box>
  );
};

export default Navbar;
