import { Box, Flex, Icon, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { IoMdMic } from "react-icons/io";
import { IoBan, IoVideocam } from "react-icons/io5";
import Avatar, { AvatarConfig, genConfig } from "react-nice-avatar";
import { useAppSelector } from "../../../app/hooks";
import KickDialog from "./KickDialog";

interface Props {}

const ParticipantTab: React.FC<Props> = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { mySocketId } = useAppSelector((state) => state.stream);
  const { users, hostId } = useAppSelector((state) => state.room.roomInfo);

  return (
    <Box color="#fff">
      {users.map(({ socketId, username, avatar }) => (
        <>
          {socketId !== mySocketId && (
            <Flex alignItems="center" key={socketId}>
              <Avatar
                style={{ width: "3rem", height: "3rem", marginRight: "1rem" }}
                {...genConfig(avatar as AvatarConfig)}
              />
              <Text>{username}</Text>
              <Box marginLeft="auto">
                <Icon
                  as={IoMdMic}
                  fontSize="1.5rem"
                  color="#77829c"
                  cursor="pointer"
                  mr="1rem"
                />
                <Icon
                  as={IoVideocam}
                  fontSize="1.5rem"
                  color="#77829c"
                  cursor="pointer"
                  mr="1rem"
                />
                {mySocketId === hostId && (
                  <>
                    <Icon
                      as={IoBan}
                      fontSize="1.5rem"
                      color="#77829c"
                      cursor="pointer"
                      mr="1rem"
                      onClick={() => setIsOpen(true)}
                    />
                    <KickDialog
                      isOpen={isOpen}
                      setIsOpen={setIsOpen}
                      socketId={socketId}
                    />
                  </>
                )}
              </Box>
            </Flex>
          )}
        </>
      ))}
    </Box>
  );
};

export default ParticipantTab;
