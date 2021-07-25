import { Box, Flex, Grid } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../../app/hooks";
import RemoteStream from "../../../components/RemoteStream2";
import calcSize from "../../../utils/render/calcSize";

interface Props {}

const UsersStream: React.FC<Props> = () => {
  const { remoteStreams } = useAppSelector((state) => state.stream);
  const { isShareScreen } = useAppSelector((state) => state.room.roomInfo);

  const [height, setHeight] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);
  const [screenIndex, setScreenIndex] = useState<number>(0);

  useEffect(() => {
    // Only use for normal mode
    if (remoteStreams.length > 0 && !isShareScreen) {
      let { width, height } = calcSize({
        width: document.getElementById("video-container")!.clientWidth,
        height: document.getElementById("video-container")!.clientHeight,
        minRatio: 9 / 16,
        maxRatio: 8 / 5,
        count: remoteStreams.length,
      });
      if (width) {
        setWidth(width);
      }
      if (height) {
        setHeight(height);
      }
    }
  }, [remoteStreams]);

  return (
    <>
      {!isShareScreen ? (
        <Flex
          id="video-container"
          flexWrap="wrap"
          h="calc(100vh - 100px - 40px)"
          justifyContent="center"
        >
          {remoteStreams.map((remoteStream, i) => (
            <Box w={width} h={height} key={i} className="overlay__container">
              <RemoteStream
                remoteStream={remoteStream}
                count={remoteStreams.length}
              />
            </Box>
          ))}
        </Flex>
      ) : (
        <Grid
          gridTemplateRows="repeat(12,1fr)"
          gridTemplateColumns="repeat(24,1fr)"
          h="calc(100vh - 100px - 40px)"
        >
          {remoteStreams.map((remoteStream, i) => (
            <>
              {i === screenIndex ? (
                <Box
                  gridArea="span 12/span 18"
                  key={i}
                  className="overlay__container"
                >
                  <RemoteStream
                    remoteStream={remoteStream}
                    count={remoteStreams.length}
                  />
                </Box>
              ) : (
                <Box
                  gridArea="span 4/span 6"
                  onClick={() => setScreenIndex(i)}
                  key={i}
                  className="overlay__container"
                >
                  <RemoteStream
                    remoteStream={remoteStream}
                    count={remoteStreams.length}
                  />
                </Box>
              )}
            </>
          ))}
        </Grid>
      )}
    </>
  );
};

export default UsersStream;
