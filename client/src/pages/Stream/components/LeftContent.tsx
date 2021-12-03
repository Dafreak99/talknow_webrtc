import { Box, Flex } from "@chakra-ui/react";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useAppSelector } from "../../../app/hooks";
import RemoteStream from "../../../components/RemoteStream";
import UsersStream from "./UsersStream";
import Whiteboard from "./Whiteboard";

interface Props {}

const RightContent: React.FC<Props> = () => {
  const { isShowedChat } = useAppSelector((state) => state.message);
  const { isWhiteBoard } = useAppSelector((state) => state.room.roomInfo);
  const { users } = useAppSelector((state) => state.room.roomInfo);
  const { mySocketId } = useAppSelector((state) => state.stream);

  return (
    <Flex
      transition="350ms all"
      width={{
        md: isShowedChat ? "65vw" : "100vw",
        lg: isShowedChat ? "77vw" : "100vw",
      }}
      position="relative"
    >
      {isWhiteBoard ? (
        <>
          <Whiteboard />
          <Box ml="10px">
            <Swiper direction={"vertical"} slidesPerView={3}>
              {users.map((user, i) => (
                <>
                  {user.socketId !== mySocketId &&
                    user.streamType !== "screen" && (
                      <SwiperSlide>
                        <Box key={i} className="overlay__container">
                          <RemoteStream user={user} count={users.length - 1} />
                        </Box>
                      </SwiperSlide>
                    )}
                </>
              ))}
            </Swiper>
          </Box>
        </>
      ) : (
        <UsersStream />
      )}
    </Flex>
  );
};

export default RightContent;
