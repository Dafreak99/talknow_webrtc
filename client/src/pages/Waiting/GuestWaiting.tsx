import { Box, Grid, Heading } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import Logo from "../../components/Logo";
import ReviewStream from "../../components/ReviewStream";
import { connectSignallingServer, getRoomInfo } from "../../utils/webSocket";
import GuestConfig from "./components/GuestConfig";

interface Props {}

const GuestWaiting: React.FC<Props> = () => {
  const params = useParams<{ roomId: string }>();
  const history = useHistory();

  useEffect(() => {
    connectSignallingServer();
    roomInfo();
  }, []);

  const roomInfo = async () => {
    try {
      await getRoomInfo(params.roomId);
    } catch (error) {
      history.goBack();
    }
  };

  return (
    <Box h="100vh" w="100vw">
      <Box className="container" p="3rem 0">
        <Logo />
      </Box>

      <Box className="container">
        <Heading mb="3rem">Pre-meeting Decision</Heading>
        <Grid gridTemplateColumns="repeat(12, 1fr)" gridGap="8rem">
          <ReviewStream style={{ gridColumn: "span 6" }} />
          <GuestConfig />
        </Grid>
      </Box>
    </Box>
  );
};

export default GuestWaiting;
