import { Box, Flex, Grid } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../../app/hooks";
import RemoteStream from "../../../components/RemoteStream2";
import calcSize from "../../../utils/render/calcSize";

interface Props {}

const UsersStream: React.FC<Props> = () => {
  const { mySocketId } = useAppSelector((state) => state.stream);
  const { users } = useAppSelector((state) => state.room.roomInfo);
  const { isShareScreen } = useAppSelector((state) => state.room.roomInfo);

  const [height, setHeight] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
    // Only use for normal mode
    if (users.length - 1 > 0 && !isShareScreen) {
      let { width, height } = calcSize({
        width: document.getElementById("video-container")!.clientWidth,
        height: document.getElementById("video-container")!.clientHeight,
        minRatio: 9 / 16,
        maxRatio: 8 / 5,
        // count: users.length - 1,
        count: 4,
      });
      if (width) {
        setWidth(width);
      }
      if (height) {
        setHeight(height);
      }
    }
  }, [users]);

  return (
    <>
      {!isShareScreen ? (
        <Flex
          id="video-container"
          flexWrap="wrap"
          h="calc(100vh - 100px - 40px)"
          justifyContent="center"
        >
          {users.map((user, i) => (
            <>
              {(user.socketId !== mySocketId ||
                user.streamType === "screen") && (
                <Box
                  w={width}
                  h={height}
                  key={i}
                  className={`overlay__container ` + user.socketId}
                >
                  <RemoteStream user={user} count={users.length - 1} />
                </Box>
              )}
            </>
          ))}
        </Flex>
      ) : (
        <Grid
          gridTemplateRows="repeat(12,1fr)"
          gridTemplateColumns="repeat(24,1fr)"
          h="calc(100vh - 100px - 40px)"
        >
          {users.map((user, i) => (
            <>
              {(user.socketId !== mySocketId ||
                user.streamType === "screen") && (
                <>
                  {user.streamType === "screen" ? (
                    <Box
                      gridColumn="1/18"
                      gridRow="1/12"
                      key={i}
                      className="overlay__container"
                    >
                      <RemoteStream user={user} count={users.length - 1} />
                    </Box>
                  ) : (
                    <Box
                      gridColumn="18/span 6"
                      gridRow="span 4"
                      key={i}
                      className="overlay__container"
                    >
                      <RemoteStream user={user} count={users.length - 1} />
                    </Box>
                  )}
                </>
              )}
            </>
          ))}
        </Grid>
      )}
    </>
  );
};

export default UsersStream;
