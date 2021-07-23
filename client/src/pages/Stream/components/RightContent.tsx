import { Box, Button, Flex, Icon, Input, Text } from "@chakra-ui/react";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FiSend } from "react-icons/fi";
import { useAppSelector } from "../../../app/hooks";
import { messaging } from "../../../utils/webSocket";

interface Props {}

interface FormValue {
  message: string;
}

const LeftContent: React.FC<Props> = () => {
  // const localStream = useAppSelector((state) => state.stream.localStream);
  // const localVideoRef = useRef<HTMLVideoElement>(null);

  // useEffect(() => {
  //   if (localStream) {
  //     localVideoRef.current!.srcObject = localStream;
  //   }
  // }, [localStream]);

  const { register, handleSubmit, reset } = useForm<FormValue>();

  const { mySocketId } = useAppSelector((state) => state.stream);
  const { messages } = useAppSelector((state) => state.message);

  const onSubmit: SubmitHandler<FormValue> = (data) => {
    messaging(data.message);
    reset();
  };

  return (
    <Flex w="20vw" flexDirection="column">
      <Flex h="60px" p="0 2rem" alignItems="center" bg="gray.100">
        <Text fontWeight="semibold">Chat</Text>
      </Flex>
      <Box p="2rem">
        {messages.map(({ from, socketId, content }) => (
          <Flex
            alignItems={socketId === mySocketId ? "flex-end" : "flex-start"}
            flexDirection="column"
            mb="5px"
          >
            <Box>
              {socketId !== mySocketId && (
                <Text mb="5px" color="gray.600">
                  {from}
                </Text>
              )}
              <Box p="8px 30px" bg="#e7eff8" borderRadius="10px">
                {content}
              </Box>
            </Box>
          </Flex>
        ))}
      </Box>

      {/* <Flex alignItems="flex-end" flexDirection="column">
          <Box>
            <Text mb="5px" color="gray.600">
              You
            </Text>
            <Box p="8px 30px" bg="#e7eff8" borderRadius="10px">
              Hello
            </Box>
          </Box>
        </Flex>
        <Flex alignItems="flex-start" flexDirection="column">
          <Box>
            <Text mb="5px" color="gray.600">
              Haitran
            </Text>
            <Box p="8px 30px" bg="#e7eff8" borderRadius="10px">
              Hello
            </Box>
          </Box>
        </Flex> */}
      <Box p="2rem" marginTop="auto">
        <Flex as="form" onSubmit={handleSubmit(onSubmit)}>
          <Input
            placeholder="Write a message"
            mr="5px"
            {...register("message", { required: true })}
          />
          <Button bg="transparent" type="submit">
            <Icon as={FiSend} />
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
};

export default LeftContent;
