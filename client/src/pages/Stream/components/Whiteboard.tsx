import { Box } from '@chakra-ui/react';
import React from 'react';

interface Props {}

const Whiteboard: React.FC<Props> = () => {
  return (
    <Box
      h="calc(100vh - 100px - 40px)"
      as="iframe"
      src="https://app.tryeraser.com/workspace/PlyCw5ua9AjjUkTaqE2C"
      title="Whiteboarding"
      w="80%"
    />
  );
};

export default Whiteboard;
