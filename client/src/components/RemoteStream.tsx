import { Box, Icon, Text } from "@chakra-ui/react";
import React, { useEffect, useRef } from "react";
import { BsArrowsFullscreen } from "react-icons/bs";
import { IoMic } from "react-icons/io5";
import ReactNiceAvatar, { AvatarConfig, genConfig } from "react-nice-avatar";
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

  const config = genConfig(user.avatar as AvatarConfig);

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
        <Icon as={IoMic} /> {user.username}
      </Text>
      {!user.isCameraEnabled && (
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
        >
          <ReactNiceAvatar
            {...config}
            style={{ width: "3rem", height: "3rem" }}
          />
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
