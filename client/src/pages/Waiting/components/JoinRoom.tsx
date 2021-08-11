import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import { useHistory, useParams } from "react-router-dom";
import {
  confirmRoomPassword,
  requestToJoin,
  userJoined,
} from "../../../utils/webSocket";

interface Props {
  admission: string;
  roomId: string;
}

interface Inputs {
  username: string;
  password: string;
}

const JoinRoom: React.FC<Props> = ({ admission, roomId }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const [requested, setRequested] = useState(false);
  const [isDeclined, setIsDeclined] = useState(false);

  const params = useParams<{ roomId: string }>();
  const toast = useToast();
  const history = useHistory();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (admission === "none") {
      userJoined(params.roomId, data.username, "guest");
      history.push("/stream");
    } else if (admission === "request") {
      setRequested(true);
      const isAccepted = await requestToJoin(params.roomId, data.username);
      if (isAccepted) {
        history.push("/stream");
      } else {
        setIsDeclined(true);
      }
    } else {
      const res = await confirmRoomPassword(roomId, data.password);
      if (res.status === "succeeded") {
        userJoined(params.roomId, data.username, "guest");
        history.push("/stream");
      } else if (res.status === "failed") {
        toast({
          status: "error",
          description: "Wrong password",
          title: "Error",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
      }
    }
  };

  if (admission === "none") {
    return (
      <Box as="form" onSubmit={handleSubmit(onSubmit)}>
        <Flex margin="0 -15px">
          <FormControl id="hostname" p="0 15px">
            <FormLabel fontWeight="semibold">Username</FormLabel>
            <Input
              type="text"
              variant="filled"
              placeholder="Enter username"
              mr="2rem"
              {...register("username", { required: true })}
            />

            {errors.username && (
              <Text mt="5px" color="red.500">
                Username is required
              </Text>
            )}
          </FormControl>
        </Flex>
        <Button
          type="submit"
          leftIcon={<AiOutlineCheck />}
          w="100%"
          bg="primary"
          color="#fff"
          size="lg"
          mt="1rem"
        >
          Join Room
        </Button>
      </Box>
    );
  } else if (admission === "request") {
    return (
      <Box as="form" onSubmit={handleSubmit(onSubmit)}>
        <Flex margin="0 -15px">
          <FormControl id="hostname" p="0 15px">
            <FormLabel fontWeight="semibold">Username</FormLabel>
            <Input
              type="text"
              variant="filled"
              placeholder="Enter username"
              mr="2rem"
              {...register("username", { required: true })}
            />

            {errors.username && (
              <Text mt="5px" color="red.500">
                Username is required
              </Text>
            )}
          </FormControl>
        </Flex>
        {isDeclined ? (
          <Button
            type="submit"
            leftIcon={<AiOutlineClose />}
            w="100%"
            colorScheme="red"
            size="lg"
            mt="1rem"
            disabled={requested}
          >
            Host declined your join request
          </Button>
        ) : (
          <Button
            type="submit"
            leftIcon={<AiOutlineCheck />}
            isLoading={requested}
            loadingText="Wait For Host's Admission"
            w="100%"
            bg="primary"
            color="#fff"
            size="lg"
            mt="1rem"
            disabled={requested}
          >
            Request To Join Room
          </Button>
        )}
      </Box>
    );
  } else {
    return (
      <Box as="form" onSubmit={handleSubmit(onSubmit)}>
        <Flex margin="0 -15px">
          <FormControl id="hostname" p="0 15px">
            <FormLabel fontWeight="semibold">Username</FormLabel>
            <Input
              type="text"
              variant="filled"
              placeholder="Enter username"
              mr="2rem"
              {...register("username", { required: true })}
            />

            {errors.username && (
              <Text mt="5px" color="red.500">
                Username is required
              </Text>
            )}
          </FormControl>
          <FormControl id="password" p="0 15px">
            <FormLabel fontWeight="semibold">Password</FormLabel>
            <Input
              type="text"
              variant="filled"
              placeholder="Enter password"
              mr="2rem"
              {...register("password", { required: true })}
            />

            {errors.password && (
              <Text mt="5px" color="red.500">
                Password is required
              </Text>
            )}
          </FormControl>
        </Flex>
        <Button
          type="submit"
          leftIcon={<AiOutlineCheck />}
          w="100%"
          bg="primary"
          color="#fff"
          size="lg"
          mt="1rem"
        >
          Join Room
        </Button>
      </Box>
    );
  }
};

export default JoinRoom;
