import { Box, Flex, Icon, Stack } from "@chakra-ui/react";
import React from "react";
import { IoMic, IoMicOff, IoVideocam, IoVideocamOff } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  setLocalCameraEnabled,
  setLocalMicrophoneEnabled,
} from "../features/stream/streamSlice";

interface Props {}

const MediaButton: React.FC<Props> = () => {
  const { localStream, localCameraEnabled, localMicrophoneEnabled } =
    useAppSelector((state) => state.stream);
  const dispatch = useAppDispatch();

  const onToggleCamera = () => {
    localStream!.getVideoTracks()[0].enabled = !localCameraEnabled;
    dispatch(setLocalCameraEnabled(!localCameraEnabled));
  };

  const onToggleMic = () => {
    localStream!.getAudioTracks()[0].enabled = !localMicrophoneEnabled;
    dispatch(setLocalMicrophoneEnabled(!localMicrophoneEnabled));
  };

  return (
    <Box
      position="absolute"
      left="50%"
      bottom="20px"
      transform="translate(-50%, 0)"
    >
      <Stack direction="row" spacing={4}>
        <Flex
          h="80px"
          w="80px"
          bg={localCameraEnabled ? "#222" : "red.600"}
          borderRadius="50%"
          justify="center"
          alignItems="center"
          cursor="pointer"
          transition="350ms all"
          _hover={{ background: "red.600" }}
          onClick={onToggleCamera}
        >
          <Icon
            as={localCameraEnabled ? IoVideocam : IoVideocamOff}
            boxSize="2rem"
            color="#fff"
          />
        </Flex>
        <Flex
          h="80px"
          w="80px"
          bg={localMicrophoneEnabled ? "#222" : "red.600"}
          borderRadius="50%"
          justify="center"
          alignItems="center"
          cursor="pointer"
          transition="350ms all"
          _hover={{ background: "red.600" }}
          onClick={onToggleMic}
        >
          <Icon
            as={localMicrophoneEnabled ? IoMic : IoMicOff}
            boxSize="2rem"
            color="#fff"
          />
        </Flex>
      </Stack>
    </Box>
  );
};

export default MediaButton;
