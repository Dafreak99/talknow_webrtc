import { Box, Icon, Image, Text } from "@chakra-ui/react";
import React, { useEffect, useRef } from "react";
import { BsArrowsFullscreen } from "react-icons/bs";
import { IoMdMic, IoMdMicOff } from "react-icons/io";
import { User } from "../types";

interface Props {
  user: User;
  count: number;
}

interface Video extends HTMLVideoElement {
  requestFullscreen: () => Promise<void>;
  webkitRequestFullscreen: () => Promise<void>;
  msRequestFullscreen: () => Promise<void>;
}

const RemoteStream: React.FC<Props> = ({ user, count }) => {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (user) {
      ref.current!.srcObject = user.stream as MediaStream;
    }
    // @ts-ignore
  }, [user.stream]);

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
      <Text
        position="absolute"
        top="5px"
        left="2rem"
        zIndex="100"
        fontWeight="semibold"
        color="#fff"
        background="#07070e6b"
        p="5px 15px"
        borderRadius="3px"
      >
        <Icon
          as={user.isMicrophoneEnabled ? IoMdMic : IoMdMicOff}
          color={user.isMicrophoneEnabled ? "#fff" : "#ff4545"}
        />{" "}
        {user.username}
      </Text>
      {!user.isCameraEnabled && (
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
        >
          <Image src={user.avatar} boxSize="3rem" borderRadius="50%" />
        </Box>
      )}
      <video
        playsInline
        autoPlay
        ref={ref}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "10px",
          objectFit: count >= 5 ? "cover" : "fill",
          borderColor: !user.isCameraEnabled
            ? "#414144"
            : user.isSpeaking
            ? "teal"
            : "transparent",
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
