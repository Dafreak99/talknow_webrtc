import { Client, Constraints, LocalStream, RemoteStream } from "ion-sdk-js";
import { Configuration } from "ion-sdk-js/lib/client";
import { IonSFUJSONRPCSignal } from "ion-sdk-js/lib/signal/json-rpc-impl";
import RecordRTC from "recordrtc";
import { store } from "../app/store";
import {
	appendNewUser,
	appendStreamToUser,
	removeUser,
	removeUserBySocketId,
	speaking,
	stopSpeaking,
	userToggleVideo,
} from "../features/room/roomSlice";
import {
	setLocalCameraEnabled,
	setLocalMicrophoneEnabled,
	setLocalStream,
	setRecordScreenEnabled,
	setShareScreenEnabled,
} from "../features/stream/streamSlice";
import { User } from "../types";
import SoundMeter from "./soundmeter";
import { shareScreenSignal, userJoined, whiteBoardSignal } from "./webSocket";

let client: any;
let screenClient: any;
let local: LocalStream;
let recorder: RecordRTC;
let datachannel: RTCDataChannel;

const config = {
	iceServers: [
		{
			urls: "stun:stun.l.google.com:19302",
		},
	],
};

// Config for recording
const displaymediastreamconstraints = {
	video: {
		displaySurface: "application", // monitor, window, application, browser
		logicalSurface: true,
		cursor: "always", // never, always, motion
	},
	audio: true,
};

const SERVER_URL =
	process.env.NODE_ENV === "development"
		? "ws://localhost:7000/ws"
		: "wss://talkserver.tk/ws";

/**
 * @description: Connect to IonSFU server as well as get local stream
 */

export const connectIonSFU = async () => {
	const { mySocketId } = store.getState().stream;
	const signal = new IonSFUJSONRPCSignal(SERVER_URL);

	client = new Client(signal, config as Configuration);

	// TODO: Maybe this one doesn't run yet
	signal.onopen = async () => {
		client.join("test session", mySocketId);

		// Setup handlers
		client.ontrack = (track: MediaStreamTrack, stream: RemoteStream) => {
			console.log("on track");
			track.onmute = () => {
				store.dispatch(appendStreamToUser(stream));
			};

			track.onmute = () => {
				if (track.kind === "video") {
					store.dispatch(appendStreamToUser(stream));
					store.dispatch(userToggleVideo(stream));
				}
			};

			track.onunmute = () => {
				if (track.kind === "video") {
					store.dispatch(appendStreamToUser(stream));
					store.dispatch(userToggleVideo(stream));
				}
			};

			track.onended = () => {
				store.dispatch(removeUser(stream));
			};

			stream.onremovetrack = (e) => {
				// get call when user close tab
				store.dispatch(removeUser(stream));
			};
		};

		local = await LocalStream.getUserMedia({
			audio: true,
			video: true,
			resolution: "vga",
			codec: "vp8",
		} as Constraints);

		store.dispatch(setLocalStream(local));

		datachannel = client.createDataChannel("data");

		datachannel.onmessage = ({ data }) => {
			store.dispatch(speaking(data));
			setTimeout(() => {
				store.dispatch(stopSpeaking(data));
			}, 300);
		};

		const audioContext = new AudioContext();

		const soundMeter = new SoundMeter(audioContext);

		soundMeter.connectToSource(local, function (e: any) {
			if (e) {
				alert(e);
				return;
			}
			setInterval(() => {
				if (soundMeter.instant > 0.05) {
					if (datachannel.readyState === "open") {
						datachannel.send(mySocketId as string);
					}
				}
			}, 200);
		});
	};
};

/**
 * @description: Publish peer connection
 */
export const publishPeer = () => {
	const { localStream } = store.getState().stream;
	client.publish(localStream);
};

/**
 * @param user: User
 * @description: Handle user join
 */
export const handleUserJoined = (user: User) => {
	store.dispatch(appendNewUser(user));
};

/**
 * @description: Turn on/off camera
 */
export const toggleCamera = () => {
	const { localCameraEnabled } = store.getState().stream;

	if (localCameraEnabled) {
		local.mute("video");
		// HOW TO KNOW IF SOMEONE TURN OFF THERE CAM
	} else {
		local.unmute("video");
	}

	store.dispatch(setLocalCameraEnabled(!localCameraEnabled));
};

/**
 * @description: Turn on/off microphone
 */
export const toggleMic = () => {
	const { localMicrophoneEnabled } = store.getState().stream;

	if (localMicrophoneEnabled) {
		local.mute("audio");
	} else {
		local.unmute("audio");
	}

	store.dispatch(setLocalMicrophoneEnabled(!localMicrophoneEnabled));
};

/**
 * @description: Turn on/off sharescreen
 */
export const toggleShareScreen = () => {
	const { shareScreenEnabled } = store.getState().stream;

	if (shareScreenEnabled) {
		shareScreenSignal();
		screenClient.leave();
	} else {
		shareScreen();
	}
	store.dispatch(setShareScreenEnabled(!shareScreenEnabled));
};

/**
 * @description: Share screen
 */
export const shareScreen = async () => {
	const signal = new IonSFUJSONRPCSignal(SERVER_URL);

	screenClient = new Client(signal, config as Configuration);

	signal.onopen = () => screenClient.join("test session");

	try {
		const { roomId } = store.getState().room.roomInfo;
		const { myUsername, myAvatar } = store.getState().stream;

		const screenShare = await LocalStream.getDisplayMedia({
			video: true,
			audio: true,
			resolution: "vga",
			codec: "vp8",
		} as Constraints);

		// If click stop share screen popup

		screenShare.getVideoTracks()[0].onended = () => toggleShareScreen();

		screenClient.publish(screenShare);
		shareScreenSignal();
		userJoined(
			roomId,
			`${myUsername}  screen`,
			"screen",
			myAvatar as string,
			screenShare
		);
	} catch (error) {
		throw error;
	}
};

/**
 * @description: Turn on/off record
 */
export const toggleRecord = async () => {
	const { recordScreenEnabled } = store.getState().stream;

	if (!recordScreenEnabled) {
		// @ts-ignore
		let screen = await navigator.mediaDevices.getDisplayMedia(
			displaymediastreamconstraints
		);

		recorder = new RecordRTC(
			screen as MediaStream,
			{
				type: "video",
				showMousePointer: true,
			} as {}
		);

		recorder.startRecording();
	} else {
		// @ts-ignore
		let { roomName } = store.getState().room.roomInfo;

		recorder.stopRecording((() => {
			let blob = recorder.getBlob();
			let fileName = `${roomName}_recording`;

			invokeSaveAsDialog(blob, fileName);
		}) as () => void);
	}

	store.dispatch(setRecordScreenEnabled(!recordScreenEnabled));
};

/**
 * @param file
 * @param fileName
 * @description: Open the dialog to save video into your machine
 */
const invokeSaveAsDialog = (file: Blob, fileName: string) => {
	if (typeof navigator.msSaveBlob !== "undefined") {
		return navigator.msSaveBlob(file, "ok");
	}

	// if navigator is not present, manually create file and download
	var hyperlink = document.createElement("a");
	hyperlink.href = URL.createObjectURL(file);
	hyperlink.download = generateFileFullName(file, fileName);

	// @ts-ignore
	hyperlink.style = "display:none;opacity:0;color:transparent;";
	(document.body || document.documentElement).appendChild(hyperlink);

	if (typeof hyperlink.click === "function") {
		hyperlink.click();
	} else {
		hyperlink.target = "_blank";
		hyperlink.dispatchEvent(
			new MouseEvent("click", {
				view: window,
				bubbles: true,
				cancelable: true,
			})
		);
	}

	URL.revokeObjectURL(hyperlink.href);
};
/**
 * @param file
 * @param fileName
 * @description: Generate the file full name from file and fileName
 */
const generateFileFullName = (file: Blob, fileName: string) => {
	let fileExtension = (file.type || "video/webm").split("/")[1];
	if (fileExtension.indexOf(";") !== -1) {
		// extended mimetype, e.g. 'video/webm;codecs=vp8,opus'
		fileExtension = fileExtension.split(";")[0];
	}
	if (fileName && fileName.indexOf(".") !== -1) {
		let splitted = fileName.split(".");
		fileName = splitted[0];
		fileExtension = splitted[1];
	}

	const fileFullName =
		(fileName || Math.round(Math.random() * 9999999999) + 888888888) +
		"." +
		fileExtension;

	return fileFullName;
};

/**
 * @description: Turn on/off whiteboard
 */
export const toggleWhiteboard = () => {
	whiteBoardSignal();
};

/**
 * @description: Peer leave room
 */
export const leave = () => {
	const { mySocketId } = store.getState().stream;

	client.close();

	store.dispatch(removeUserBySocketId(mySocketId));
};

/**
 * @description: Stop browser from using cam/mic
 */
export const closeMediaStream = () => {
	local.getTracks().forEach((track) => track.stop());
};
