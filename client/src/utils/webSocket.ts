import { LocalStream } from 'ion-sdk-js';
import io, { Socket } from 'socket.io-client';
import { store } from '../app/store';
import {
  setMessage,
  setToggleNewMessage,
} from '../features/message/messageSlice';
import {
  Answer,
  setPollData,
  updatePollVotes,
} from '../features/poll/pollSlice';
import {
  enqueueJoinRequests,
  receiveShareScreen,
  removeUserScreen,
  setIsWhiteBoard,
  setRoomInfo,
  switchMic,
} from '../features/room/roomSlice';
import {
  hostLeave,
  setAvatar,
  setSocketId,
  setUsername,
} from '../features/stream/streamSlice';
import { ConfigRoom } from '../types';
import { handleUserJoined } from './ionSFU';
import { handleScreen, handleSignaling } from './webRTC';

let socket: Socket;
let socketId: undefined | string;

/**
 * Connect to Node.js signalling server
 */
export const connectSignallingServer = async () => {
  socket =
    process.env.NODE_ENV === 'development'
      ? io('http://localhost:5000')
      : io('https://talkserver.gq/');

  socket.on('connect', function () {
    socketId = socket.id;
    store.dispatch(setSocketId(socketId));
  });

  socket.on('roominfo', (info) => store.dispatch(setRoomInfo(info)));

  socket.on('host-leave', () => store.dispatch(hostLeave(null)));

  socket.on('user-joined', handleUserJoined);

  socket.on('signal', gotMessageFromServer);

  socket.on('signal-screen', handleScreen);

  socket.on('broadcast-message', (data) => {
    const { isShowedChat } = store.getState().message;

    if (!isShowedChat) {
      store.dispatch(setToggleNewMessage());
    }

    store.dispatch(setMessage(data));
  });

  socket.on('share-screen', () => {
    const { isShareScreen } = store.getState().room.roomInfo;

    if (isShareScreen) {
      store.dispatch(removeUserScreen());
    }
    store.dispatch(receiveShareScreen(!isShareScreen));
  });

  socket.on('white-board', () => {
    store.dispatch(setIsWhiteBoard());
  });

  socket.on('request-to-join', (socketId, username) => {
    store.dispatch(enqueueJoinRequests({ socketId, username }));
  });

  socket.on(
    'send-poll-data',
    (data: { question: string; answers: Answer[] }) => {
      store.dispatch(setPollData(data));
    },
  );

  socket.on('send-vote', (answer: string) => {
    store.dispatch(updatePollVotes(answer));
  });

  socket.on('toggle-mic', (boo: boolean, from: string) => {
    store.dispatch(switchMic({ boo, from }));
  });
};

export const createRoom = (data: ConfigRoom) => {
  const { localStream, mySocketId, localMicrophoneEnabled } =
    store.getState().stream;

  socket.emit('user-joined', {
    data: {
      ...data,
      streamType: 'host',
      streamId: localStream!.id,
      isMicrophoneEnabled: localMicrophoneEnabled,
    },
    type: 'host',
  });

  store.dispatch(setUsername(data.hostName));
  store.dispatch(setAvatar(data.avatar));

  store.dispatch(
    setRoomInfo({
      ...data,
      streamId: localStream!.id,
      users: [],
    }),
  );

  socket.on('host-room-info', (data) => {
    store.dispatch(
      setRoomInfo({ ...data, streamId: localStream!.id, hostId: mySocketId }),
    );
  });
};

export const userJoined = (
  roomId: string,
  username: string,
  type: 'guest' | 'screen',
  avatar: string,
  screenShare?: LocalStream,
) => {
  let localStream: LocalStream;

  if (type === 'guest') {
    localStream = store.getState().stream.localStream as LocalStream;
    store.dispatch(setUsername(username));
  } else {
    localStream = screenShare as LocalStream;
  }

  const { localMicrophoneEnabled } = store.getState().stream;

  store.dispatch(setAvatar(avatar));

  socket.emit('user-joined', {
    data: {
      roomId,
      username,
      streamId: localStream!.id,
      streamType: type,
      avatar,
      isMicrophoneEnabled: localMicrophoneEnabled,
    },
    type,
  });
};

export const requestToJoin = (
  roomId: string,
  username: string,
): Promise<boolean> => {
  socket.emit('request-to-join', roomId, username);

  return new Promise((resolve, reject) => {
    socket.on('answer-requeqst-to-join', (isAccepted: boolean) => {
      resolve(isAccepted);
    });
  });
};

export const answerRequestToJoin = (data: {
  socketId: string;
  isAccepted: boolean;
}) => {
  socket.emit('answer-request-to-join', data);
};

export const getRoomInfo = (roomId: string) => {
  return new Promise((resolve, reject) => {
    socket.emit('get-room-info', roomId);

    socket.on('get-room-info', (data) => {
      if (data.status === 'failed') {
        reject();
      } else {
        resolve(data);
        store.dispatch(setRoomInfo(data.data));
      }
    });
  });
};

export const confirmRoomPassword = (
  roomId: string,
  password: string,
): Promise<{ status: string }> => {
  return new Promise((resolve, reject) => {
    socket.emit('confirm-room-password', roomId, password);

    socket.on('confirm-room-password', (data) => resolve(data));
  });
};

const gotMessageFromServer = async (fromId: string, signal: any) => {
  //Make sure it's not coming from yourself
  if (fromId !== socketId) {
    handleSignaling(fromId, signal);
  }
};

export const signaling = (id: string, data: any) => {
  socket.emit('signal', id, data);
};

export const screenShareSignaling = (
  to: string,
  data: {
    sdp: RTCSessionDescriptionInit;
  },
  event: string,
) => {
  socket.emit('signal-screen', to, data, event);
};

export const screenShareSignaling2 = (
  to: string,
  data: { candidate: RTCIceCandidate },
  event: string,
) => {
  socket.emit('signal-screen', to, data, event);
};

export const messaging = (message: string) => {
  const { myAvatar, myUsername } = store.getState().stream;

  socket.emit('broadcast-message', {
    from: myUsername,
    content: message,
    timestamp: new Date(),
    avatar: myAvatar,
  });
};

export const ionScreen = (initialize: boolean) => {
  socket.emit('ion-screen', initialize);
};

export const shareScreenSignal = () => {
  const { roomId } = store.getState().room.roomInfo;

  socket.emit('share-screen', roomId);
};

export const whiteBoardSignal = () => {
  const { roomId } = store.getState().room.roomInfo;

  socket.emit('white-board', roomId);
};

export const kickUser = (socketId: string) => {
  socket.emit('kick-user', socketId);
};

export const listenToKickUser = (): Promise<boolean> => {
  return new Promise((resolve, _) => {
    socket.on('kick-user', () => {
      resolve(true);
    });
  });
};

/**
 * @description: Trigger disconnection event in the server
 */
export const forceToLeave = () => {
  socket.disconnect();
};

/**
 * @description: Host sends poll question and answers to users
 */
export const sendPollData = (data: { question: string; answers: Answer[] }) => {
  const { roomId } = store.getState().room.roomInfo;

  socket.emit('send-poll-data', data, roomId);
};

/**
 * @description: User sends their vote's selection back to host
 */
export const sendvote = (answer: string) => {
  const { hostId } = store.getState().room.roomInfo;

  socket.emit('send-vote', { hostId, answer });
};

/**
 * @description: Send on/off microphone signal to other participants
 */
export const toggleMicSocket = (boo: boolean) => {
  const { roomId } = store.getState().room.roomInfo;
  const { mySocketId } = store.getState().stream;

  socket.emit('toggle-mic', boo, roomId, mySocketId);
};
