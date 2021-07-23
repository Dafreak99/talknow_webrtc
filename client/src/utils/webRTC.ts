import { store } from "../app/store";
import {
  setLocalStream,
  setRemoteStreams,
} from "../features/stream/streamSlice";
import { User } from "../types";
import {
  screenShareSignaling,
  screenShareSignaling2,
  signaling,
} from "./webSocket";

let connections: RTCPeerConnection[] = [];
let prevRemoteStreamId: undefined | string;
let screenPeer: RTCPeerConnection;

const config = {
  iceServers: [
    { urls: "stun:stun.services.mozilla.com" },
    { urls: "stun:stun.l.google.com:19302" },
  ],
};

const defaultConstraints = {
  audio: true,
  video: true,
};

export const getLocalStream = () => {
  navigator.mediaDevices
    .getUserMedia(defaultConstraints)
    .then((stream) => {
      store.dispatch(setLocalStream(stream));

      screenPeer = new RTCPeerConnection(config);
      for (let track of stream!.getTracks()) {
        screenPeer.addTrack(track, stream as MediaStream);
      }
    })
    .catch((err) => console.log(err.message));
};

export const handleUserJoined = async (
  id: string,
  count: number,
  users: User[]
) => {
  console.log("user-joined");
  const localStream = store.getState().stream.localStream;

  users.forEach(({ socketId, username }) => {
    if (!connections[socketId as any]) {
      connections[socketId as any] = new RTCPeerConnection(config);

      const peer = connections[socketId as any];

      for (let track of localStream!.getTracks()) {
        peer.addTrack(track, localStream as MediaStream);
      }

      //Wait for their ice candidate
      peer.onicecandidate = (event) => {
        if (event.candidate) {
          signaling(socketId, { candidate: event.candidate });
        }
      };

      // Wait for streams
      peer.ontrack = ({ streams }) => {
        // Set remote streams
        console.log("get stream");

        console.log(streams);

        if (prevRemoteStreamId !== streams[0].id) {
          store.dispatch(
            setRemoteStreams({
              username,
              stream: streams[0],
              socketId: socketId,
            })
          );
          prevRemoteStreamId = streams[0].id;
        }
      };
    }
  });

  // Create an offer to connect with your local description

  if (count >= 2) {
    console.log("joined id", id);
    // The user who've just joined will send offer
    const offer = await connections[id as any].createOffer();
    await connections[id as any].setLocalDescription(offer);

    signaling(id, { sdp: offer });
  }
};

export const handleSignaling = async (fromId: string, data: any) => {
  if (data.sdp) {
    await connections[fromId as any].setRemoteDescription(
      new RTCSessionDescription(data.sdp)
    );
    if (data.sdp.type === "offer") {
      const anwser = await connections[fromId as any].createAnswer();

      await connections[fromId as any].setLocalDescription(anwser);

      signaling(fromId, { sdp: anwser });
    }
  }

  if (data.candidate) {
    connections[fromId as any]
      .addIceCandidate(new RTCIceCandidate(data.candidate))
      .catch((e: any) => console.log(e));
  }
};

// With this function, only the sender can receive the stream
// the recevier does't
export const shareScreen = async () => {
  let captureStream: MediaStream;

  try {
    // @ts-ignore
    captureStream = await navigator.mediaDevices.getDisplayMedia({
      video: {
        cursor: "always",
      },
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
      },
    });

    store.dispatch(
      setRemoteStreams({
        username: "screen",
        stream: captureStream,
        socketId: "123",
      })
    );

    screenPeer = new RTCPeerConnection(config);

    for (let track of captureStream!.getTracks()) {
      screenPeer.addTrack(track, captureStream);
    }

    const offer = await screenPeer.createOffer();

    await screenPeer.setLocalDescription(offer);

    // Send a broadcast signal contains screen
    screenShareSignaling("", { sdp: offer }, "SEND_OFFER");

    // //Wait for their ice candidate
    // screenPeer.onicecandidate = (event) => {
    //   if (event.candidate) {
    //     screenShareSignaling2("", { candidate: event.candidate }, "SEND_ICE");
    //   }
    // };

    screenPeer.ontrack = ({ streams }) => {
      console.log(streams);
    };
  } catch (err) {
    console.error("Error: " + err);
  }
};
// 1
export const handleScreen = async (
  fromId: string,
  data: any,
  event: string
) => {
  if (event === "SEND_OFFER") {
    if (data.sdp) {
      if (data.sdp.type === "offer") {
        await screenPeer.setRemoteDescription(
          new RTCSessionDescription(data.sdp)
        );

        const anwser = await screenPeer.createAnswer();

        await screenPeer.setLocalDescription(anwser);

        screenShareSignaling(fromId, { sdp: anwser }, "SEND_ANSWER");

        screenPeer.onicecandidate = (event) => {
          if (event.candidate) {
            screenShareSignaling2(
              fromId,
              { candidate: event.candidate },
              "SEND_ICE"
            );
          }
        };

        screenPeer.ontrack = (event) => {
          console.log(event);
        };
      }
    }
  }

  if (event === "SEND_ANSWER") {
    await screenPeer.setRemoteDescription(new RTCSessionDescription(data.sdp));
    screenPeer.onicecandidate = (event) => {
      if (event.candidate) {
        screenShareSignaling2(
          fromId,
          { candidate: event.candidate },
          "SEND_ICE"
        );
      }
    };
  }

  if (event === "SEND_ICE") {
    console.log("receive ice");
    if (data.candidate) {
      console.log(screenPeer);
      screenPeer
        .addIceCandidate(new RTCIceCandidate(data.candidate))
        .catch((e: any) => console.log(e));
    }
  }
};

// TODO: Somehow 1 doesn't continue to send ICE after 2 answer
// Normally, 1'll keep send ICE even after received answer from 2
