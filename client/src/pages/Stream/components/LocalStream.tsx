import { Box } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import { useAppSelector } from "../../../app/hooks";

interface Props {}
const LocalStream: React.FC<Props> = () => {
  const { localStream } = useAppSelector((state) => state.stream);
  const [isMinimize, setIsMinimize] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    videoRef.current!.srcObject = localStream;
  }, [localStream]);

  const onClick = () => {
    setIsMinimize(true);
  };

  return (
    <Draggable bounds="parent">
      <Box
        position="absolute"
        top="5%"
        right="5%"
        borderRadius={isMinimize ? "50%" : 0}
        height="150px"
        width="250px"
        onDoubleClick={onClick}
      >
        <video muted playsInline autoPlay ref={videoRef} />
      </Box>
    </Draggable>
  );
};

export default LocalStream;
