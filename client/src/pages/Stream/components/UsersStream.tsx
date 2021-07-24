import { Box, Flex } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../../app/hooks";
import RemoteStream from "../../../components/RemoteStream2";
import calcSize from "../../../utils/render/calcSize";

interface Props {}

const UsersStream: React.FC<Props> = () => {
  const localStream = useAppSelector((state) => state.stream.localStream);
  const remoteStreams = useAppSelector((state) => state.stream.remoteStreams);
  const [height, setHeight] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);
  const [screenIndex, setScreenIndex] = useState<number>(0);

  useEffect(() => {
    console.log(remoteStreams.length);
    if (remoteStreams.length > 0) {
      console.log(document.getElementById("video-container")!.clientWidth);
      console.log(document.getElementById("video-container")!.clientHeight);
      let { width, height } = calcSize({
        width: document.getElementById("video-container")!.clientWidth,
        height: document.getElementById("video-container")!.clientHeight,
        minRatio: 9 / 16,
        maxRatio: 8 / 5,
        count: remoteStreams.length,
      });
      console.log(width, height);
      if (width) {
        setWidth(width);
      }
      if (height) {
        setHeight(height);
      }
    }
  }, [remoteStreams]);

  return (
    <Flex
      id="video-container"
      flexWrap="wrap"
      h="calc(100vh - 100px - 40px)"
      justifyContent="center"
    >
      {remoteStreams.map((remoteStream, i) => (
        <Box w={width} h={height}>
          <RemoteStream
            key={i}
            remoteStream={remoteStream}
            count={remoteStreams.length}
          />
        </Box>
      ))}
    </Flex>
    // <Grid
    //   gridTemplateRows="repeat(12,1fr)"
    //   gridTemplateColumns="repeat(24,1fr)"
    //   h="calc(100vh - 100px - 40px)"
    // >
    //   {remoteStreams.map((remoteStream, i) => (
    //     <>
    //       {i === screenIndex ? (
    //         <Box gridArea="span 12/span 20/13/25">
    //           <RemoteStream
    //             key={i}
    //             remoteStream={remoteStream}
    //             count={remoteStreams.length}
    //           />
    //         </Box>
    //       ) : (
    //         <Box gridArea="span 4/span 4" onClick={() => setScreenIndex(i)}>
    //           <RemoteStream
    //             key={i}
    //             remoteStream={remoteStream}
    //             count={remoteStreams.length}
    //           />
    //         </Box>
    //       )}
    //     </>
    //   ))}
    // </Grid>
  );
};

export default UsersStream;
