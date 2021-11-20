import { Box } from '@chakra-ui/layout';
import { Button, Flex } from '@chakra-ui/react';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import React from 'react';
import { useHistory } from 'react-router-dom';
import Logo from './Logo';

interface Props {}

const Navbar: React.FC<Props> = () => {
  const { push } = useHistory();

  return (
    <Flex
      gridColumn="span 12"
      p="3rem 0"
      alignItems="center"
      justify="space-between"
    >
      <Logo />
      <Box>
        <SignedIn>
          <UserButton
            afterSignOutAllUrl={
              process.env.NODE_ENV === 'production' ? 'https://talknow.tk' : '/'
            }
          />
        </SignedIn>
        <SignedOut>
          <Button onClick={() => push('/sign-in')}>Sign In</Button>
        </SignedOut>
      </Box>
    </Flex>
  );
};

export default Navbar;
