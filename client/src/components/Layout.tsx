import React, { ReactNode } from 'react';
import Navbar from './Navbar';
import Wrapper from './Wrapper';

interface LayoutProps {
  children: ReactNode;
}
const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Navbar />
      <Wrapper>{children}</Wrapper>
    </>
  );
};

export default Layout;
