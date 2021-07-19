import { Flex } from "@chakra-ui/react";
import React from "react";
import LeftContent from "./components/LeftContent";
import RightContent from "./components/RightContent";

interface Props {}

const Stream: React.FC<Props> = () => {
  // If use Ion-SFU
  // useEffect(() => {
  //   getLocalStream();
  // }, []);

  return (
    <Flex height="100vh" width="100vw">
      <LeftContent />
      <RightContent />
    </Flex>
  );
};

export default Stream;
