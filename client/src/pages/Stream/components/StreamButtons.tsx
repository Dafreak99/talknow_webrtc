import { Flex, Icon, Stack } from "@chakra-ui/react";
import React from "react";
import { BsFillChatFill } from "react-icons/bs";
import { FaPhoneAlt } from "react-icons/fa";
import { IoMdMic, IoMdMicOff } from "react-icons/io";
import { IoVideocam, IoVideocamOff } from "react-icons/io5";
import { MdScreenShare } from "react-icons/md";
import { RiRecordCircleLine } from "react-icons/ri";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { setToggleShowChat } from "../../../features/stream/streamSlice";
import { shareScreen, toggleCamera, toggleMic } from "../../../utils/ionSFU";

interface Props {}

const StreamButtons: React.FC<Props> = () => {
  const { localStream, localCameraEnabled, localMicrophoneEnabled } =
    useAppSelector((state) => state.stream);
  const dispatch = useAppDispatch();

  const onToggleChat = () => {
    dispatch(setToggleShowChat());
  };

  return (
    <Flex
      h="100px"
      // bg="#fff"
      // border="1px solid #dbd8d8"
      bg="#0e0f10"
      justify="center"
      alignItems="center"
    >
      <Stack direction="row" spacing={8}>
        <Flex
          justify="center"
          alignItems="center"
          h="4rem"
          w="4rem"
          borderRadius="50%"
          bg="#202020"
          cursor="pointer"
          onClick={toggleCamera}
        >
          <Icon
            as={localCameraEnabled ? IoVideocam : IoVideocamOff}
            color="#fff"
            fontSize="1.5rem"
          />
        </Flex>

        <Flex
          justify="center"
          alignItems="center"
          h="4rem"
          w="4rem"
          borderRadius="50%"
          bg="#202020"
          cursor="pointer"
          onClick={toggleMic}
        >
          <Icon
            as={localMicrophoneEnabled ? IoMdMic : IoMdMicOff}
            color="#fff"
            fontSize="1.5rem"
          />
        </Flex>

        <Flex
          justify="center"
          alignItems="center"
          h="4rem"
          w="4rem"
          borderRadius="50%"
          bg="#202020"
          cursor="pointer"
          onClick={shareScreen}
        >
          <Icon as={MdScreenShare} color="#fff" fontSize="1.5rem" />
        </Flex>

        <Flex
          justify="center"
          alignItems="center"
          h="4rem"
          w="4rem"
          borderRadius="50%"
          bg="#202020"
          cursor="pointer"
        >
          <Icon as={RiRecordCircleLine} color="#fff" fontSize="1.5rem" />
        </Flex>
        <Flex
          justify="center"
          alignItems="center"
          h="4rem"
          w="4rem"
          borderRadius="50%"
          bg="#202020"
          cursor="pointer"
          onClick={onToggleChat}
        >
          <Icon as={BsFillChatFill} color="#fff" fontSize="1.5rem" />
        </Flex>

        <Flex
          justify="center"
          alignItems="center"
          h="4rem"
          w="4rem"
          borderRadius="50%"
          bg="red.600"
          cursor="pointer"
        >
          <Icon as={FaPhoneAlt} color="#fff" fontSize="1.5rem" />
        </Flex>
      </Stack>
    </Flex>
  );
};

export default StreamButtons;
