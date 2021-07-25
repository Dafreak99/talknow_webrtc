import { Flex } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { publishPeer } from "../../utils/ionSFU";
import LeftContent from "./components/LeftContent";
import RightContent from "./components/RightContent";
import StreamButtons from "./components/StreamButtons";

interface Props {}

const Stream: React.FC<Props> = () => {
  useEffect(() => {
    // For testing now, delete this later
    // connectIonSFU();

    // Normal
    publishPeer();
    // window.addEventListener("beforeunload", alertUser);

    // return () => {
    //   window.removeEventListener("beforeunload", alertUser);
    // };
  }, []);

  // const alertUser = (e: BeforeUnloadEvent) => {
  //   e.preventDefault();
  //   e.returnValue = "";
  // };

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
