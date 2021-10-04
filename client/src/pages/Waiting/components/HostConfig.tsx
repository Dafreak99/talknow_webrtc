import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Input,
  InputGroup,
  InputRightElement,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { BsCheck } from "react-icons/bs";
import { GrPowerReset } from "react-icons/gr";
import Avatar, { genConfig } from "react-nice-avatar";
import { useHistory } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { ConfigRoom } from "../../../types";
import { createRoom } from "../../../utils/webSocket";

interface Props {}

const HostConfig: React.FC<Props> = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ConfigRoom>();
  const history = useHistory();
  const [avatarGender, setAvatarGender] = useState("man");
  const config = genConfig({ sex: avatarGender as any });

  const onSubmit: SubmitHandler<ConfigRoom> = (data) => {
    createRoom(data, config);
    history.push("/stream");
  };

  return (
    <Box
      width={{ base: "60%", md: "50%" }}
      as="form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Grid
        gridTemplateColumns="repeat(2, 1fr)"
        gridColumnGap={{ base: "0", md: "1rem", xl: "3rem" }}
      >
        <FormControl gridColumn="span 2">
          <FormLabel fontWeight="semibold">Avatar</FormLabel>
          <Flex alignItems="center">
            <Avatar
              style={{
                width: "3rem",
                height: "3rem",
                marginRight: "1rem",
              }}
              {...config}
            />
            <RadioGroup
              onChange={(value) => setAvatarGender(value)}
              value={avatarGender}
            >
              <Stack direction="row">
                <Radio value="man">Male</Radio>
                <Radio value="woman">Female</Radio>
              </Stack>
            </RadioGroup>
          </Flex>
        </FormControl>
        <FormControl id="hostname">
          <FormLabel fontWeight="semibold">Hostname</FormLabel>
          <Input
            type="text"
            variant="filled"
            placeholder="Enter hostname"
            {...register("hostName", { required: true })}
          />
          {errors.hostName && (
            <Text mt="5px" color="red.500">
              Host name is required
            </Text>
          )}
        </FormControl>
        <FormControl id="roomName">
          <FormLabel fontWeight="semibold">Room Name</FormLabel>
          <Input
            type="text"
            variant="filled"
            placeholder="Enter roomname"
            {...register("roomName", { required: true })}
          />

          {errors.roomName && (
            <Text mt="5px" color="red.500">
              Room Name is required
            </Text>
          )}
        </FormControl>
        <FormControl id="roomId" gridColumn="span 2">
          <FormLabel fontWeight="semibold">Room ID</FormLabel>
          <Controller
            name="roomId"
            rules={{ required: true }}
            defaultValue={uuidv4()}
            control={control}
            render={({ field }) => (
              <InputGroup {...field}>
                <Input
                  type="text"
                  variant="filled"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                />
                <InputRightElement
                  cursor="pointer"
                  children={<GrPowerReset />}
                  onClick={() => field.onChange(uuidv4())}
                />
              </InputGroup>
            )}
          />

          {errors.roomId && (
            <Text mt="5px" color="red.500">
              RoomID is required
            </Text>
          )}
        </FormControl>

        <FormControl id="admission" gridRow="span 2">
          <FormLabel fontWeight="semibold">Admission</FormLabel>

          <Controller
            name="admission"
            control={control}
            defaultValue="none"
            render={({ field }) => (
              <RadioGroup {...field}>
                <Stack direction="column">
                  <Radio value="none">None</Radio>
                  <Radio value="request">Request to join</Radio>
                  <Radio value="password">Require meeting password</Radio>

                  <Controller
                    name="password"
                    defaultValue={
                      field.value !== "password" ? "" : uuidv4().slice(0, 8)
                    }
                    control={control}
                    rules={{
                      required: field.value === "password",
                    }}
                    render={({ field: passwordField }) => (
                      <InputGroup {...passwordField}>
                        <Input
                          type="text"
                          readOnly
                          value={passwordField.value}
                          variant="filled"
                          disabled={field.value !== "password"}
                          onChange={(e) =>
                            passwordField.onChange(e.target.value)
                          }
                        />
                        <InputRightElement
                          cursor="pointer"
                          children={<GrPowerReset />}
                          onClick={() =>
                            passwordField.onChange(uuidv4().slice(0, 8))
                          }
                        />
                      </InputGroup>
                    )}
                  />
                  {errors.password && (
                    <Text mt="5px" color="red.500">
                      Please generate password
                    </Text>
                  )}
                </Stack>
              </RadioGroup>
            )}
          />
        </FormControl>

        <FormControl id="media">
          <FormLabel fontWeight="semibold">Participant</FormLabel>

          <Controller
            name="allowVideo"
            control={control}
            defaultValue="true"
            render={({ field }) => (
              <RadioGroup {...field}>
                <Flex>
                  <Text mr="2rem">Video</Text>
                  <Stack direction="row">
                    <Radio value="true">Yes</Radio>
                    <Radio value="false">No</Radio>
                  </Stack>
                </Flex>
              </RadioGroup>
            )}
          />

          <Controller
            name="allowAudio"
            control={control}
            defaultValue="true"
            render={({ field }) => (
              <RadioGroup {...field}>
                <Flex>
                  <Text mr="2rem">Audio</Text>
                  <Stack direction="row">
                    <Radio value="true">Yes</Radio>
                    <Radio value="false">No</Radio>
                  </Stack>
                </Flex>
              </RadioGroup>
            )}
          />
        </FormControl>
      </Grid>
      <Flex justify="flex-end" mt="3rem">
        <Button
          type="submit"
          bg="primary"
          variant="outline"
          color="#fff"
          fontWeight="400"
          leftIcon={<BsCheck />}
        >
          Done
        </Button>
      </Flex>
    </Box>
  );
};

export default HostConfig;