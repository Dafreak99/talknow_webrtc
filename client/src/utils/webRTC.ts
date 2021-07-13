import { store } from "../app/store";
import {
  setLocalStream,
  setRemoteStreams,
} from "../features/stream/streamSlice";
import { User } from "../types";
import { signaling } from "./webSocket";

let connections: RTCPeerConnection[] = [];
let prevRemoteStreamId: undefined | string;

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
      // connect();
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

      for (let track of localStream!.getTracks()) {
        connections[socketId as any].addTrack(
          track,
          localStream as MediaStream
        );
      }

      //   store.dispatch(setConnection(connections[socketId as any]));

      //Wait for their ice candidate
      (connections[socketId as any] as RTCPeerConnection).onicecandidate = (
        event
      ) => {
        if (event.candidate) {
          signaling(socketId, { candidate: event.candidate });
        }
      };

      // Wait for streams
      (connections[socketId as any] as RTCPeerConnection).ontrack = ({
        streams,
      }) => {
        // Set remote streams
        console.log("get stream");

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
