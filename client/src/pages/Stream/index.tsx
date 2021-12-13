import { Flex, useToast } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { closeMediaStream, leave, publishPeer } from "../../utils/ionSFU";
import { forceToLeave, listenToKickUser } from "../../utils/webSocket";
import JoinRequest from "./components/JoinRequest";
import LeftContent from "./components/LeftContent";
import LocalStream from "./components/LocalStream";
import MinimizeCircle from "./components/MinimizeCircle";
import PollDisplay from "./components/PollDisplay";
import RightContent from "./components/RightContent";
import StreamButtons from "./components/StreamButtons";

interface Props {}

const Stream: React.FC<Props> = () => {
  const toast = useToast();
  const history = useHistory();
  const { minimizeLocalStream } = useAppSelector((state) => state.stream);
  const [second, setSecond] = useState(2);

  useEffect(() => {
    publishPeer();
    // If host kick you, this'll be call
    listenToKick();

    return localStorage.removeItem("roomId");
  }, []);

  const listenToKick = async () => {
    let res = await listenToKickUser();

    toast({
      title: "Host've ask you to leave.",
      description: `You'll be automatically removed from the room after ${second} seconds`,
      status: "warning",
      duration: 2000,
      onCloseComplete: () => {
        closeMediaStream();
        leave();
        forceToLeave();
        history.push("/");
      },
    });

    setInterval(() => {
      setSecond((prev) => prev - 1);
    }, 1000);
  };

  return (
    <>
      <JoinRequest />
      <Flex position="relative" p="20px" bg="#13141b">
        <LeftContent />
        <RightContent />
        {minimizeLocalStream ? <MinimizeCircle /> : <LocalStream />}
      </Flex>
      <PollDisplay />
      <StreamButtons />
    </>
  );
};

export default Stream;
