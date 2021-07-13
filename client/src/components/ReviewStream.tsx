import { Box, Flex, Spinner, Text } from "@chakra-ui/react";
import React, { useEffect, useRef } from "react";
import { useAppSelector } from "../app/hooks";
import MediaButton from "./MediaButton";

interface Props {
  style: {};
}

const ReviewStream: React.FC<Props> = ({ style }) => {
  const localStream = useAppSelector((state) => state.stream.localStream);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (localStream) {
      videoRef.current!.srcObject = localStream;
    }
  }, [localStream]);

  return (
    <Box {...style}>
      <Box height="auto" position="relative">
        {/* Video */}
        <video
          ref={videoRef}
          playsInline
          muted
          autoPlay
          style={{
            borderRadius: "10px",
            width: "100%",
            height: "25rem",
            background: "#000",
            objectFit: "cover",
            objectPosition: "top",
          }}
        />

        {/* Video/Audio Button or Loading Indicator*/}
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
            <Text fontSize="1.5rem">Loading your video/audio</Text>
          </Flex>
        )}
      </Box>
    </Box>
  );
};

export default ReviewStream;
