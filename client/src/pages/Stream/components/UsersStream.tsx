import { Box, Flex } from "@chakra-ui/react";
import React from "react";
import { useAppSelector } from "../../../app/hooks";
import RemoteStream from "../../../components/RemoteStream";

interface Props {}

const UsersStream: React.FC<Props> = () => {
  const { remoteStreams } = useAppSelector((state) => state.stream);

  return (
    <Flex h="calc(100vh - 100px)" flexWrap="wrap">
      {remoteStreams.length > 0 &&
        remoteStreams.map((remoteStream, i) => (
          <Box h="50%" w="50%">
            <RemoteStream key={i} remoteStream={remoteStream} />
          </Box>
        ))}
    </Flex>
  );
};

export default UsersStream;
