import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { Box, IconButton } from '@chakra-ui/react';
import React from 'react';

const PostEditDeleteButtons = () => {
  return (
    <Box>
      <IconButton icon={<EditIcon />} aria-label="edit" mr={4} />
      <IconButton icon={<DeleteIcon />} aria-label="delete" colorScheme="red" mr={4} />
    </Box>
  );
};

export default PostEditDeleteButtons;
