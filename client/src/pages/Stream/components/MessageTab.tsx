import {
  Box,
  Flex,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useOutsideClick,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { BaseEmoji, Picker } from "emoji-mart";
import React, { FormEvent, useRef, useState } from "react";
import { FiSend } from "react-icons/fi";
import { MdInsertEmoticon } from "react-icons/md";
import Avatar, { AvatarConfig, genConfig } from "react-nice-avatar";
import { useAppSelector } from "../../../app/hooks";
import { messaging } from "../../../utils/webSocket";

interface Props {}

const MessageTab: React.FC<Props> = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState("");

  const { messages } = useAppSelector((state) => state.message);
  const { mySocketId } = useAppSelector((state) => state.stream);

  const ref = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useOutsideClick({
    ref: ref,
    handler: () => setIsModalOpen(false),
  });

  const config = genConfig();

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!message) return;

    messaging(message);
    setMessage("");
    scrollToBottom();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const onSelectEmoji = (data: BaseEmoji) => {
    setMessage(message + data.native);
  };

  return (
    <>
      <Box h="60vh" overflow="scroll" className="hide-scroll-bar">
        {messages.map(({ from, socketId, content, timestamp, avatar }) => (
          <Flex
            key={timestamp}
            alignItems={socketId === mySocketId ? "flex-end" : "flex-start"}
            mb="15px"
          >
            {socketId !== mySocketId && (
              <Avatar
                style={{ width: "2rem", height: "2rem", marginRight: "1rem" }}
                {...genConfig(avatar as AvatarConfig)}
              />
            )}
            <Box marginLeft={socketId === mySocketId ? "auto" : "0"}>
              <Text mb="5px" color="gray.300">
                {socketId !== mySocketId
                  ? `${from}, ${format(new Date(timestamp), "hh:mm")}`
                  : "You, " + format(new Date(timestamp), "hh:mm")}
              </Text>

              <Box p="8px 30px" bg="#e7eff8" borderRadius="10px">
                {content}
              </Box>
            </Box>
          </Flex>
        ))}
        <Box ref={messagesEndRef} />
      </Box>
      <Box mt="auto">
        <Flex
          as="form"
          onSubmit={onSubmit}
          position="relative"
          alignItems="center"
        >
          <InputGroup>
            <Input
              border="2px solid #75777d"
              placeholder="Write a message"
              mr="5px"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              color="#fff"
              autoComplete="off"
            />
            <InputRightElement
              children={<FiSend color="rgb(146, 158, 150)" />}
            />
            <InputRightElement
              children={<FiSend color="rgb(146, 158, 150)" />}
            />
          </InputGroup>

          {isModalOpen ? (
            <Box ref={ref as any} cursor="pointer">
              <Picker
                onSelect={onSelectEmoji}
                style={{ position: "absolute", bottom: "150%", right: 0 }}
              />
              <Icon
                as={MdInsertEmoticon}
                boxSize="1.5rem"
                color="#fff"
                onClick={() => setIsModalOpen(!isModalOpen)}
              />
            </Box>
          ) : (
            <Icon
              as={MdInsertEmoticon}
              boxSize="1.5rem"
              color="#fff"
              onClick={() => setIsModalOpen(!isModalOpen)}
            />
          )}
        </Flex>
      </Box>
    </>
  );
};

export default MessageTab;
