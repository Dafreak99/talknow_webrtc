import { Flex, Image } from "@chakra-ui/react";
import React from "react";
import Draggable from "react-draggable";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { setMinimizeLocalstream } from "../../../features/stream/streamSlice";

interface Props {}

const MinimizeCircle: React.FC<Props> = () => {
  const { myAvatar } = useAppSelector((state) => state.stream);
  const dispatch = useAppDispatch();

  const onOpenFullLocalStream = () => {
    dispatch(setMinimizeLocalstream(false));
  };
  return (
    <Draggable bounds="parent">
      <Flex
        h="50px"
        w="50px"
        position="absolute"
        left="20px"
        zIndex="100"
        cursor="pointer"
        background="#1754dd"
        justifyContent="center"
        alignItems="center"
        borderRadius="50%"
        boxShadow="0 4px 8px rgb(243 241 241 / 10%)"
        onDoubleClick={onOpenFullLocalStream}
      >
        <Image
          src={myAvatar as string}
          alt="mini"
          borderRadius="50%"
          h="40px"
          w="40px"
        />
      </Flex>
    </Draggable>
  );
};

export default MinimizeCircle;
