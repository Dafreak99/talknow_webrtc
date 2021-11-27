import { Box, Text } from '@chakra-ui/react';
import React, { useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import { useAppSelector } from '../../../app/hooks';

interface Props {}
const LocalStream: React.FC<Props> = () => {
  const { localStream, localCameraEnabled, myUsername } = useAppSelector(
    (state) => state.stream
  );
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    videoRef.current!.srcObject = localStream;
  }, [localStream]);

  return (
    <Draggable bounds="parent">
      <Box
        position="absolute"
        top="5%"
        right="5%"
        height="150px"
        width="250px"
        zIndex="100"
      >
        {!localCameraEnabled && (
          <Text
            color="#fff"
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%,-50%)"
          >
            {myUsername} (you)
          </Text>
        )}
        <video muted playsInline autoPlay ref={videoRef} />
      </Box>
    </Draggable>
  );
};

export default LocalStream;
