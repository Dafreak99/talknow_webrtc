import { Box, Grid, Heading } from "@chakra-ui/react";
import React, { useEffect } from "react";
import Logo from "../../components/Logo";
import ReviewStream from "../../components/ReviewStream";
import { connectIonSFU } from "../../utils/ionSFU";
import { connectSignallingServer } from "../../utils/webSocket";
import Config from "./components/Config";

interface Props {}

const HostWaiting: React.FC<Props> = () => {
  useEffect(() => {
    connectIonSFU();
    connectSignallingServer();
  });

  return (
    <Box h="100vh" w="100vw">
      <Box className="container" p="3rem 0">
        <Logo />
      </Box>

      <Box className="container">
        <Heading mb="3rem">Config Meeting Room</Heading>
        <Grid gridTemplateColumns="repeat(12, 1fr)" gridGap="8rem">
          <ReviewStream style={{ gridColumn: "span 6" }} />
          <Config />
        </Grid>
      </Box>
    </Box>
  );
};

export default HostWaiting;
