import { Box, Flex, Heading } from "@chakra-ui/react";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/clerk-react";
import React, { useEffect } from "react";
import Navbar from "../../components/Navbar";
import ReviewStream from "../../components/ReviewStream";
import { connectIonSFU } from "../../utils/ionSFU";
import { connectSignallingServer } from "../../utils/webSocket";
import HostConfig from "./components/HostConfig";

interface Props {}

const HostWaiting: React.FC<Props> = () => {
  useEffect(() => {
    connectSignallingServer();

    //Connect Media Server
    connectIonSFU();
  }, []);

  return (
    <Box h="100vh" w="100vw">
      <SignedIn>
        <Box className="container">
          <Navbar />
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
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </Box>
  );
};

export default HostWaiting;
