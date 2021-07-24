import { Flex } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { getLocalStream } from "../../utils/ionSFU";
import LeftContent from "./components/LeftContent";
import RightContent from "./components/RightContent";
import StreamButtons from "./components/StreamButtons";

interface Props {}

const Stream: React.FC<Props> = () => {
  useEffect(() => {
    getLocalStream();
  }, []);

  return (
    <>
      <Flex position="relative" p="20px" bg="#000">
        <LeftContent />
        <RightContent />
      </Flex>
      <StreamButtons />
    </>
  );
};

export default Stream;
