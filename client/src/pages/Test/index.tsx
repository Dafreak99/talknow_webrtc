import { Box, Button, Flex, Select } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../app/hooks";
import { store } from "../../app/store";
import RemoteStream from "../../components/RemoteStream2";
import {
  setLocalStream,
  setRemoteStreams,
} from "../../features/stream/streamSlice";
import renderer from "../../utils/render";
import calcSize from "../../utils/render/calcSize";

const streamList: any[] = [];

const Test = () => {
  const localStream = useAppSelector((state) => state.stream.localStream);
  const remoteStreams = useAppSelector((state) => state.stream.remoteStreams);
  const [height, setHeight] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
    renderer.init("video-container", 9 / 16, 8 / 5);

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        store.dispatch(setLocalStream(stream));
      });
  }, []);

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

  const addStream = () => {
    store.dispatch(setRemoteStreams({ stream: localStream }));
  };

  return (
    <>
      <header>
        <Button onClick={addStream}>Add</Button>
        <Button>Remove</Button>
        {/* <input type="button" value="Add" id="add" /> */}
        {/* <input type="button" value="Remove" id="remove" /> */}
        <Select name="mode" id="mode">
          <option value={0}>Tile mode</option>
          <option value={1}>PIP mode</option>
          <option value={2}>Screen Sharing Mode</option>
        </Select>
      </header>
      <Flex
        id="video-container"
        flexWrap="wrap"
        h="calc(100vh - 100px)"
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
    </>
  );
};

export default Test;
