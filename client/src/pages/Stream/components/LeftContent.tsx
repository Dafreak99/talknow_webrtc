import { Box } from "@chakra-ui/react";
import React from "react";
import { useAppSelector } from "../../../app/hooks";
import LocalStream from "./LocalStream";
import UsersStream from "./UsersStream";
import Whiteboard from "./Whiteboard";

interface Props {}

const RightContent: React.FC<Props> = () => {
  const { isShowedChat } = useAppSelector((state) => state.message);
  const { isWhiteBoard } = useAppSelector((state) => state.room.roomInfo);

  return (
    <Box
      transition="350ms all"
      width={isShowedChat ? "77vw" : "100vw"}
      position="relative"
    >
      {isWhiteBoard ? <Whiteboard /> : <UsersStream />}
      <LocalStream />
    </Box>
  );
};

export default RightContent;
