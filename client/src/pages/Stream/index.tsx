import { Flex } from "@chakra-ui/react";
import React from "react";
import LeftContent from "./components/LeftContent";
import RightContent from "./components/RightContent";
import StreamButtons from "./components/StreamButtons";

interface Props {}

const Stream: React.FC<Props> = () => {
  // useEffect(() => {
  //   getLocalStream();
  // }, []);

  return (
    <>
      <Flex w="100vw">
        <LeftContent />
        <RightContent />
      </Flex>
      <StreamButtons />
    </>
  );
};

export default Stream;
