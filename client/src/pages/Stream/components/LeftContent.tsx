import { Box } from "@chakra-ui/react";
import React, { useEffect, useRef } from "react";
import { useAppSelector } from "../../../app/hooks";

interface Props {}

const LeftContent: React.FC<Props> = () => {
  const localStream = useAppSelector((state) => state.stream.localStream);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  //   useEffect(() => {
  //     getLocalStream();
  //   }, []);
  useEffect(() => {
    if (localStream) {
      localVideoRef.current!.srcObject = localStream;
    }
  }, [localStream]);

  return (
    <Box w="20vw">
      {localStream && <video ref={localVideoRef} muted playsInline autoPlay />}
    </Box>
  );
};

export default LeftContent;
