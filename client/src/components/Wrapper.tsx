import { Box } from '@chakra-ui/react';
import React, { ReactNode } from 'react';

interface WrapperProps {
  children: ReactNode;
  size?: 'small' | 'regular';
}
const Wrapper = ({ children, size = 'regular' }: WrapperProps) => {
  return (
    <Box maxW={size === 'regular' ? '800px' : '400px'} w="100%" mt={8} mx="auto">
      {children}
    </Box>
  );
};

export default Wrapper;
