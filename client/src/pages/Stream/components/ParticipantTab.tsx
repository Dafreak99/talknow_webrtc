import { Box, Flex, Icon, Text } from "@chakra-ui/react";
import React from "react";
import { IoMdMic } from "react-icons/io";
import { IoVideocam } from "react-icons/io5";
import Avatar, { genConfig } from "react-nice-avatar";

interface Props {}

const config = genConfig();

const ParticipantTab: React.FC<Props> = () => {
  return (
    <Box color="#fff">
      <Flex alignItems="center">
        <Avatar
          style={{ width: "3rem", height: "3rem", marginRight: "1rem" }}
          {...config}
        />
        <Text>Haitran</Text>
        <Box marginLeft="auto">
          <Icon
            as={IoMdMic}
            fontSize="2rem"
            color="#77829c"
            cursor="pointer"
            mr="1rem"
          />
          <Icon
            as={IoVideocam}
            fontSize="2rem"
            color="#77829c"
            cursor="pointer"
          />
        </Box>
      </Flex>
    </Box>
  );
};

export default ParticipantTab;
