import { Box, Flex, Spinner, Text } from '@chakra-ui/react';
import React, { useEffect, useRef } from 'react';
import { useAppSelector } from '../app/hooks';
import MediaButton from './MediaButton';

interface Props {}

const ReviewStream: React.FC<Props> = () => {
  const localStream = useAppSelector((state) => state.stream.localStream);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (localStream) {
      videoRef.current!.srcObject = localStream;
    }
  }, [localStream]);

  return (
    <Box width={{ base: '40%', md: '50%' }}>
      <Box height="auto" position="relative">
        {/* Video */}
        <video
          ref={videoRef}
          playsInline
          muted
          autoPlay
          className="review-stream"
          style={{
            borderRadius: '10px',
            width: '100%',
            background: '#000',
            objectFit: 'cover',
            objectPosition: 'top',
          }}
        />

        {localStream ? (
          <MediaButton />
        ) : (
          <Flex
            color="grayText"
            alignItems="center"
            position="absolute"
            transform="translate(-50%, -50%)"
            top="50%"
            left="50%"
          >
            <Spinner mr="1rem" />
            <Text fontSize="1.5rem" whiteSpace="nowrap">
              Loading your video/audio
            </Text>
          </Flex>
        )}
      </Box>
    </Box>
  );
};

export default ReviewStream;
