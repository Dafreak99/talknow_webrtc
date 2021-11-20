import { Box, Flex, Text } from '@chakra-ui/layout';
import { SignIn } from '@clerk/clerk-react';
import React from 'react';
import { MdKeyboardBackspace } from 'react-icons/md';
import { useHistory } from 'react-router';
interface Props {}

const SignInPage: React.FC<Props> = () => {
  const { push } = useHistory();

  return (
    <Flex
      justify="center"
      alignItems="center"
      h="100vh"
      w="100vw"
      background="primary"
    >
      <Flex
        position="absolute"
        top="5%"
        left="5%"
        color="#c7c7cb"
        alignItems="center"
        cursor="pointer"
        onClick={() => push('/')}
      >
        <Box as={MdKeyboardBackspace} mr="0.5rem" boxSize="1.5rem" />
        <Text fontSize="1.5rem">Back</Text>
      </Flex>
      <SignIn
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        afterSignInUrl={
          process.env.NODE_ENV === 'production' ? 'https://talknow.tk' : '/'
        }
      />
    </Flex>
  );
};

export default SignInPage;
