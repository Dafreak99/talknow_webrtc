import { Box, Flex, Heading } from '@chakra-ui/react';
import { RedirectToSignIn, SignedIn, SignedOut } from '@clerk/clerk-react';
import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Logo from '../../components/Logo';
import Navbar from '../../components/Navbar';
import ReviewStream from '../../components/ReviewStream';
import { connectIonSFU } from '../../utils/ionSFU';
import { connectSignallingServer, getRoomInfo } from '../../utils/webSocket';
import GuestConfig from './components/GuestConfig';

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
      //Connect Media Server
      connectIonSFU();
    } catch (error) {
      history.goBack();
    }
  };

  return (
    <Box h="100vh" w="100vw">
      <SignedIn>
        <Box className="container">
          <Navbar />
        </Box>

        <Box className="container">
          <Heading mb="3rem">Pre-meeting Decision</Heading>
          <Flex style={{ gap: '40px' }}>
            <ReviewStream />
            <GuestConfig />
          </Flex>
        </Box>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </Box>
  );
};

export default GuestWaiting;
