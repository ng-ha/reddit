import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { Box, IconButton } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

interface Props {
  postId: string;
}

const PostEditDeleteButtons = ({ postId }: Props) => {
  return (
    <Box>
      <NextLink href={`/post/edit/${postId}`}>
        <IconButton icon={<EditIcon />} aria-label="edit" mr={4} />
      </NextLink>
      <IconButton icon={<DeleteIcon />} aria-label="delete" colorScheme="red" mr={4} />
    </Box>
  );
};

export default PostEditDeleteButtons;
