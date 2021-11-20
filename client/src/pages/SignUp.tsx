import { Box, Flex, Text } from '@chakra-ui/layout';
import { SignUp } from '@clerk/clerk-react';
import React from 'react';
import { MdKeyboardBackspace } from 'react-icons/md';
import { useHistory } from 'react-router';
interface Props {}

const SignUpPage: React.FC<Props> = () => {
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
      <SignUp
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        afterSignInUrl={
          process.env.NODE_ENV === 'production' ? 'https://talknow.tk' : '/'
        }
      />
    </Flex>
  );
};

export default SignUpPage;
