import { Reference, useMutation, useQuery } from '@apollo/client';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { Box, IconButton, Spinner, useToast } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import { PaginatedPosts } from '../__generated__/graphql';
import { deletePostMutation } from '../graphql-client/mutations/deletePost';
import { meQuery } from '../graphql-client/queries/me';

interface Props {
  postId: string;
  postUserId: string;
}

type Existing = Pick<PaginatedPosts, '__typename' | 'cursor' | 'hasMore' | 'totalCount'> & {
  paginatedPosts: Reference[];
};

const PostEditDeleteButtons = ({ postId, postUserId }: Props) => {
  const { data: meData, loading } = useQuery(meQuery);
  const toast = useToast();
  const [deletePost] = useMutation(deletePostMutation);
  const router = useRouter();

  const onPostDelete = async (id: string) => {
    const response = await deletePost({
      variables: { id },
      update: (cache, { data }) => {
        if (data?.deletePost.success) {
          cache.modify({
            fields: {
              posts: (existing: Existing) => {
                const newPostsAfterDeletion = {
                  ...existing,
                  totalCount: existing.totalCount - 1,
                  paginatedPosts: existing.paginatedPosts.filter(
                    (postRefObj) => postRefObj.__ref !== `Post:${postId}`
                  ),
                };
                return newPostsAfterDeletion;
              },
            },
          });
        }
      },
    });
    if (response.data?.deletePost.success) {
      toast({
        title: `Post deleted successfully`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } else if (response.data?.deletePost.success === false) {
      toast({
        title: `${response.data.deletePost.message}!`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
    if (router.route !== '/') router.push('/');
  };
  if (loading) return <Spinner />;
  if (meData?.me?.id !== postUserId)
    return (
      <Box>
        <IconButton icon={<EditIcon />} aria-label="edit" mr={4} isDisabled />
        <IconButton icon={<DeleteIcon />} aria-label="delete" colorScheme="red" mr={4} isDisabled />
      </Box>
    );
  return (
    <Box>
      <NextLink href={`/post/edit/${postId}`}>
        <IconButton icon={<EditIcon />} aria-label="edit" mr={4} />
      </NextLink>
      <IconButton
        icon={<DeleteIcon />}
        aria-label="delete"
        colorScheme="red"
        mr={4}
        onClick={onPostDelete.bind(this, postId)}
      />
    </Box>
  );
};

export default PostEditDeleteButtons;
