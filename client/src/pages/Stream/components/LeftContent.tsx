import { Box } from "@chakra-ui/react";
import React from "react";
import { useAppSelector } from "../../../app/hooks";
import LocalStream from "./LocalStream";
import Whiteboard from "./Whiteboard";

interface Props {}

const RightContent: React.FC<Props> = () => {
  const { isShowedChat } = useAppSelector((state) => state.message);

  return (
    <Box
      transition="350ms all"
      width={isShowedChat ? "77vw" : "100vw"}
      position="relative"
    >
      {/* <UsersStream /> */}
      <Whiteboard />
      <LocalStream />
    </Box>
  );
};

export default RightContent;
