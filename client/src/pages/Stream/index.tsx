import { Flex } from "@chakra-ui/react";
import React from "react";
import LeftContent from "./components/LeftContent";
import RightContent from "./components/RightContent";

interface Props {}

const Stream: React.FC<Props> = () => {
  return (
    <Flex height="100vh" width="100vw">
      <RightContent />
      <LeftContent />
    </Flex>
  );
};

export default Stream;
