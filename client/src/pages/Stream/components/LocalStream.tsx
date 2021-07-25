import { Box } from "@chakra-ui/react";
import React, { useEffect, useRef } from "react";
import Draggable from "react-draggable";
import { useAppSelector } from "../../../app/hooks";

interface Props {}
const LocalStream: React.FC<Props> = () => {
  const { localStream } = useAppSelector((state) => state.stream);
  const videoRef = useRef<HTMLVideoElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    videoRef.current!.srcObject = localStream;
  }, [localStream]);

  const onClick = () => {
    console.log("hey");
  };

  return (
    <Draggable bounds="parent">
      <Box
        className=".handle"
        position="absolute"
        top="5%"
        right="5%"
        height="150px"
        width="250px"
        onDoubleClick={onClick}
        ref={boxRef}
      >
        <video muted playsInline autoPlay ref={videoRef} />
      </Box>
    </Draggable>
  );
};

export default LocalStream;
