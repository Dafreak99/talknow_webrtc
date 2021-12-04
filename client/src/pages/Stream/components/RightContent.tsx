import { Flex, Icon, Text } from "@chakra-ui/react";
import "emoji-mart/css/emoji-mart.css";
import React, { useState } from "react";
import { CgClose } from "react-icons/cg";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { setToggleShowChat } from "../../../features/message/messageSlice";
import { updateLayout } from "../../../features/room/roomSlice";
import MessageTab from "./MessageTab";
import ParticipantTab from "./ParticipantTab";

interface Props {}

const RightContent: React.FC<Props> = () => {
  const dispatch = useAppDispatch();
  const [index, setIndex] = useState(0);
  const [isMessageTab, setIsMessageTab] = useState(true);

  const { users } = useAppSelector((state) => state.room.roomInfo);
  const { isShowedChat } = useAppSelector((state) => state.message);

  return (
    <Flex
      width={{ md: "30vw", lg: "20vw" }}
      flexDirection="column"
      boxShadow="0 4px 16px rgb(209 209 226 / 10%)"
      bg="#1a1d28"
      h="calc(100% - 40px)"
      borderRadius="10px"
      transition="350ms all"
      position="absolute"
      right={isShowedChat ? "20px" : "-100%"}
    >
      <Flex
        p="1rem 2rem"
        justify="space-between"
        alignItems="center"
        bg="primary"
        borderTopLeftRadius="10px"
        borderTopRightRadius="10px"
      >
        <Flex>
          <Text
            fontWeight="semibold"
            p={{ base: "10px 10px", xl: "10px 15px" }}
            bg={index === 0 ? "#c2d6ef" : "transparent"}
            color={index === 0 ? "#344880" : "gray.200"}
            borderRadius="10px"
            cursor="pointer"
            onClick={() => {
              setIndex(0);
              setIsMessageTab(true);
            }}
            fontSize={{ md: "12px", "2xl": "1rem" }}
          >
            Messages
          </Text>
          <Text
            fontWeight="semibold"
            p="10px 15px"
            bg={index === 1 ? "#c2d6ef" : "transparent"}
            color={index === 1 ? "#344880" : "gray.200"}
            borderRadius="10px"
            cursor="pointer"
            fontSize={{ md: "12px", "2xl": "1rem" }}
            onClick={() => {
              setIndex(1);
              setIsMessageTab(false);
            }}
          >
            Participants({users.length - 1})
          </Text>
        </Flex>
        <Icon
          as={CgClose}
          fontSize="1.5rem"
          cursor="pointer"
          color="gray.300"
          onClick={() => {
            dispatch(setToggleShowChat());
            dispatch(updateLayout());
          }}
        />
      </Flex>
      <Flex p="2rem" flexDirection="column" h="calc(100vh - 200px)">
        {isMessageTab ? <MessageTab /> : <ParticipantTab />}
      </Flex>
    </Flex>
  );
};

export default RightContent;
