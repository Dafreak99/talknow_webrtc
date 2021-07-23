import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { AiOutlinePlus } from "react-icons/ai";
import { IoEnterOutline } from "react-icons/io5";
import { SiGoogleclassroom } from "react-icons/si";
import { useHistory } from "react-router-dom";
import Logo from "../../components/Logo";

interface Props {}
interface Inputs {
  roomId: string;
}
const Home: React.FC<Props> = () => {
  const history = useHistory();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  // useEffect(() => {
  //   shareScreen();
  // }, []);

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    history.push(`/guest-waiting/${data.roomId}`);
  };

  return (
    <Grid h="100vh" w="100vw" gridTemplateColumns="repeat(12,1fr)">
      <Box gridColumn="span 6" p="2rem 4rem">
        <Logo />
        <Heading color="#505C66" fontSize="6xl" mt="4rem">
          Video Conf.
        </Heading>
        <Text w="500px" mt="2rem">
          Real-time meetings by Google. Using your browser, share your video,
          desktop, and presentations with teammates and customers. Working
          remotely with ease,
        </Text>
        <Flex
          alignItems="center"
          mt="4rem"
          as="form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <InputGroup w="20rem" mr="1rem">
            <InputLeftElement
              pointerEvents="none"
              children={<SiGoogleclassroom color="gray" />}
            />
            <Input
              variant="filled"
              placeholder="Enter room ID"
              {...register("roomId", { required: true })}
            />
          </InputGroup>

          <Button leftIcon={<IoEnterOutline />} type="submit">
            Join room
          </Button>
        </Flex>
        {errors.roomId && (
          <Text mt="5px" color="red.500">
            Please enter room ID
          </Text>
        )}
        <Text fontSize="3xl" my="2rem" fontWeight="semibold">
          OR
        </Text>
        {/* TODO: Turn off light signal(enable getting media) in cam when comeback to home page */}
        <Button
          bg="primary"
          color="#fff"
          leftIcon={<AiOutlinePlus style={{ color: "#f3f3f3" }} />}
          onClick={() => history.push("/host-waiting")}
        >
          {" "}
          Create room
        </Button>
      </Box>

      <Box gridColumn="span 6" p="6rem 4rem" bg="primary"></Box>
    </Grid>
  );
};
export default Home;
