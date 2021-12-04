import { Box, Text } from "@chakra-ui/react";
import React, { useEffect, useRef } from "react";
import Draggable from "react-draggable";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { setMinimizeLocalstream } from "../../../features/stream/streamSlice";

interface Props {}
const LocalStream: React.FC<Props> = () => {
  const dispatch = useAppDispatch();
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
        height={{ md: "100px", lg: "150px" }}
        width={{ md: "200px", lg: "250px" }}
        zIndex="100"
        onDoubleClick={() => {
          dispatch(setMinimizeLocalstream(true));
        }}
      >
        {!localCameraEnabled && (
          <Text
            color="#fff"
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%,-50%)"
            zIndex="100"
            textAlign="center"
          >
            {myUsername} (you)
          </Text>
        )}
        <video
          muted
          playsInline
          autoPlay
          ref={videoRef}
          style={{
            transform: "scaleX(-1)",
            cursor: "pointer",
            borderRadius: "10px",
          }}
        />
      </Box>
    </Draggable>
  );
};

export default LocalStream;
