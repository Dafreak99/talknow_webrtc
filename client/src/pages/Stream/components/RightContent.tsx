import { Box, Button } from "@chakra-ui/react";
import React, { useEffect, useRef } from "react";
import { useAppSelector } from "../../../app/hooks";
import { messaging } from "../../../utils/webSocket";

interface Props {}

const LeftContent: React.FC<Props> = () => {
  const localStream = useAppSelector((state) => state.stream.localStream);
  const localVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (localStream) {
      localVideoRef.current!.srcObject = localStream;
    }
  }, [localStream]);

  return (
    <Box w="20vw">
      {localStream && <video ref={localVideoRef} muted playsInline autoPlay />}
      <Button onClick={messaging}>Click</Button>
    </Box>
  );
};

export default LeftContent;
