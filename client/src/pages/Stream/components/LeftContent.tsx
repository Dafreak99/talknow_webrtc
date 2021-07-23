import { Box } from "@chakra-ui/react";
import React from "react";
import UsersStream from "./UsersStream";

interface Props {}

const RightContent: React.FC<Props> = () => {
  return (
    <Box width="80vw" bg="#000">
      <UsersStream />
    </Box>
  );
};

export default RightContent;
