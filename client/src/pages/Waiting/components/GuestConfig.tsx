import {
  Badge,
  Box,
  Icon,
  List,
  ListItem,
  Skeleton,
  Stack,
} from "@chakra-ui/react";
import { SignedIn, useUser } from "@clerk/clerk-react";
import React from "react";
import { AiFillThunderbolt } from "react-icons/ai";
import { useAppSelector } from "../../../app/hooks";
import JoinRoom from "./JoinRoom";

interface Props {}

const GuestConfig: React.FC<Props> = () => {
  const { roomInfoReady } = useAppSelector((state) => state.room);

  const {
    roomId,
    roomName,
    hostName,
    allowAudio,
    allowVideo,
    users,
    admission,
  } = useAppSelector((state) => state.room.roomInfo);

  const user = useUser();

  console.log(user);

  return (
    <Box width={{ base: "60%", md: "50%" }}>
      <Box
        p="3rem 2rem"
        bg="#fff"
        boxShadow="0 10px 30px rgba(0,0,0,.1)"
        borderRadius="5px"
      >
        {roomInfoReady ? (
          <>
            <List
              spacing={2}
              mb="2rem"
              display="grid"
              gridTemplateColumns="1fr 1fr"
            >
              <ListItem gridColumn="span 2" mb="1rem">
                <Box as="span" fontWeight="semibold" mr="5px">
                  <Icon as={AiFillThunderbolt} /> Room:
                </Box>
                {roomId} | {roomName}
              </ListItem>
              <ListItem>
                <Box as="span" fontWeight="semibold" mr="5px">
                  <Icon as={AiFillThunderbolt} /> Hostname:
                </Box>
                {hostName}
              </ListItem>
              <ListItem>
                <Box as="span" fontWeight="semibold" mr="5px">
                  <Icon as={AiFillThunderbolt} /> Video:
                </Box>
                <Badge colorScheme={allowVideo ? "green" : "red"}>
                  {allowVideo.toString()}
                </Badge>
              </ListItem>
              <ListItem>
                <Box as="span" fontWeight="semibold" mr="5px">
                  <Icon as={AiFillThunderbolt} /> Number of Users:
                </Box>
                {users.length}
              </ListItem>

              <ListItem>
                <Box as="span" fontWeight="semibold" mr="5px">
                  <Icon as={AiFillThunderbolt} /> Audio:
                </Box>
                <Badge colorScheme={allowAudio ? "green" : "red"}>
                  {allowAudio.toString()}
                </Badge>
              </ListItem>
            </List>
            <SignedIn>
              <JoinRoom admission={admission} roomId={roomId} />
            </SignedIn>
          </>
        ) : (
          <Stack>
            <Skeleton height="50px" w="100px" />
            <Skeleton height="50px" />
            <Skeleton height="50px" />
            <Skeleton height="50px" />
          </Stack>
        )}
      </Box>
    </Box>
  );
};

export default GuestConfig;
