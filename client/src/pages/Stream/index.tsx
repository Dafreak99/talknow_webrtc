import { Flex } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { publishPeer } from "../../utils/ionSFU";
import JoinRequest from "./components/JoinRequest";
import LeftContent from "./components/LeftContent";
import RightContent from "./components/RightContent";
import StreamButtons from "./components/StreamButtons";

interface Props {}

const Stream: React.FC<Props> = () => {
  useEffect(() => {
    publishPeer();
  }, []);

  return (
    <>
      <JoinRequest />
      <Flex position="relative" p="20px" bg="#13141b">
        <LeftContent />
        <RightContent />
      </Flex>
      <StreamButtons />
    </>
  );
};

export default Stream;
