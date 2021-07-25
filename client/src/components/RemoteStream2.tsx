import { Box } from "@chakra-ui/react";
import React, { useEffect, useRef } from "react";
import { BsArrowsFullscreen } from "react-icons/bs";
import { RemoteStream as RemoteStreamType } from "../features/stream/streamSlice";

interface Props {
  remoteStream: RemoteStreamType;
  count: number;
}

interface Video extends HTMLVideoElement {
  requestFullscreen: () => Promise<void>;
  webkitRequestFullscreen: () => Promise<void>;
  msRequestFullscreen: () => Promise<void>;
}

const RemoteStream: React.FC<Props> = ({ remoteStream, count }) => {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (remoteStream) {
      ref.current!.srcObject = remoteStream.stream;
    }
  }, [remoteStream]);

  const onOpenFullScreen = () => {
    if (ref.current) {
      const video = ref.current as Video;

      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if (video.webkitRequestFullscreen) {
        /* Safari */
        video.webkitRequestFullscreen();
      } else if (video.msRequestFullscreen) {
        /* IE11 */
        video.msRequestFullscreen();
      }
    }
  };

  return (
    <>
      <video
        playsInline
        autoPlay
        ref={ref}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "10px",
          objectFit: count >= 5 ? "cover" : "contain",
        }}
      />
      <Box
        as={BsArrowsFullscreen}
        color="#fff"
        boxSize="2rem"
        position="absolute"
        bottom="20px"
        right="20px"
        className="overlay__content"
        onClick={onOpenFullScreen}
      />
    </>
  );
};

export default RemoteStream;
