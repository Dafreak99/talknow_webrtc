import { Box, Flex, Heading } from "@chakra-ui/react";
import React, { useEffect } from "react";
import Logo from "../../components/Logo";
import ReviewStream from "../../components/ReviewStream";
import { connectSignallingServer } from "../../utils/webSocket";
import HostConfig from "./components/HostConfig";

interface Props {}

const HostWaiting: React.FC<Props> = () => {
  useEffect(() => {
    connectSignallingServer();
  }, []);

  return (
    <Box h="100vh" w="100vw">
      <Box className="container" p="3rem 0">
        <Logo />
      </Box>

      <Box className="container">
        <Flex justify="space-between" alignItems="center">
          <Heading mb="3rem">Config Meeting Room</Heading>
        </Flex>
        <Flex style={{ gap: "40px" }}>
          <ReviewStream />
          <HostConfig />
        </Flex>
      </Box>
    </Box>
  );
};

export default HostWaiting;
