import { Box, Flex, Icon, Image, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { IoMdMic } from 'react-icons/io';
import { IoBan, IoVideocam } from 'react-icons/io5';
import { useAppSelector } from '../../../app/hooks';
import KickDialog from './KickDialog';

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
            <Flex alignItems="center" key={socketId} mb="0.5rem">
              <Image src={avatar} boxSize="3rem" borderRadius="50%" mr="5px" />

              <Text>{username}</Text>
              <Box marginLeft="auto">
                <Icon
                  as={IoMdMic}
                  fontSize={{ base: '1rem', '2xl': '1.5rem' }}
                  color="#77829c"
                  cursor="pointer"
                  mr="1rem"
                />
                <Icon
                  as={IoVideocam}
                  fontSize={{ base: '1rem', '2xl': '1.5rem' }}
                  color="#77829c"
                  cursor="pointer"
                  mr="1rem"
                />
                {mySocketId === hostId && (
                  <>
                    <Icon
                      as={IoBan}
                      fontSize={{ base: '1rem', '2xl': '1.5rem' }}
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
