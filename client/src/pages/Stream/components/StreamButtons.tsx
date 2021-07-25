import { Flex, Icon, Stack, Tooltip } from "@chakra-ui/react";
import React from "react";
import { BsChatFill } from "react-icons/bs";
import { FaPhoneAlt } from "react-icons/fa";
import { IoMdMic, IoMdMicOff } from "react-icons/io";
import { IoVideocam, IoVideocamOff } from "react-icons/io5";
import { MdScreenShare, MdStopScreenShare } from "react-icons/md";
import { RiRecordCircleLine } from "react-icons/ri";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { setToggleShowChat } from "../../../features/message/messageSlice";
import {
  leave,
  toggleCamera,
  toggleMic,
  toggleRecord,
  toggleShareScreen,
} from "../../../utils/ionSFU";

interface Props {}

const StreamButtons: React.FC<Props> = () => {
  const { localCameraEnabled, localMicrophoneEnabled, shareScreenEnabled } =
    useAppSelector((state) => state.stream);
  const dispatch = useAppDispatch();

  const onToggleChat = () => {
    dispatch(setToggleShowChat());
  };

  const buttons = [
    {
      tooltip: localMicrophoneEnabled
        ? "Turn off microphone"
        : "Turn on microphone",
      onClick: toggleMic,
      icon: localMicrophoneEnabled ? IoMdMic : IoMdMicOff,
    },
    {
      tooltip: localCameraEnabled ? "Turn off camera" : "Turn on camera",
      onClick: toggleCamera,
      icon: localCameraEnabled ? IoVideocam : IoVideocamOff,
    },
    {
      tooltip: shareScreenEnabled ? "Stop share screen" : "Share screen",
      onClick: toggleShareScreen,
      icon: shareScreenEnabled ? MdStopScreenShare : MdScreenShare,
    },
    {
      tooltip: "Record this meeting",
      onClick: toggleRecord,
      icon: RiRecordCircleLine,
    },
    { tooltip: "Chat", onClick: onToggleChat, icon: BsChatFill },
    { tooltip: "Hang up", onClick: leave, icon: FaPhoneAlt },
  ];

  return (
    <Flex h="100px" bg="#1a1d28" justify="center" alignItems="center">
      <Stack direction="row" spacing={8}>
        {buttons.map(({ tooltip, icon, onClick }, i) => (
          <Tooltip label={tooltip} fontSize="md" aria-label="A tooltip">
            <Flex
              justify="center"
              alignItems="center"
              h="4rem"
              w="4rem"
              borderRadius="50%"
              bg={i === buttons.length - 1 ? "red.600" : "#2e333e"}
              cursor="pointer"
              onClick={onClick}
            >
              <Icon as={icon} color="#fff" fontSize="1.5rem" />
            </Flex>
          </Tooltip>
        ))}
      </Stack>
    </Flex>
  );
};

export default StreamButtons;
