import { Box } from "@chakra-ui/react";
import React from "react";
import StreamButtons from "./StreamButtons";
import UsersStream from "./UsersStream";

interface Props {}

const RightContent: React.FC<Props> = () => {
  return (
    <Box width="80vw" bg="#000">
      <UsersStream />
      <StreamButtons />
    </Box>
  );
};

export default RightContent;
