import {
	Box,
	Flex,
	Icon,
	Menu,
	MenuButton,
	MenuList,
	Stack,
	Text,
	Tooltip,
	useToast,
} from "@chakra-ui/react";
import React from "react";
import { AiFillStop } from "react-icons/ai";
import { BsChatFill } from "react-icons/bs";
import { FaCircle, FaPhoneAlt, FaStopCircle } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";
import { IoMdMic, IoMdMicOff } from "react-icons/io";
import { IoVideocam, IoVideocamOff } from "react-icons/io5";
import { MdScreenShare, MdStopScreenShare } from "react-icons/md";
import { RiArtboardFill } from "react-icons/ri";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { setToggleShowChat } from "../../../features/message/messageSlice";
import { updateLayout } from "../../../features/room/roomSlice";
import {
	leave,
	toggleCamera,
	toggleMic,
	toggleRecord,
	toggleShareScreen,
	toggleWhiteboard,
} from "../../../utils/ionSFU";
import InviteDialog from "./InviteDialog";
import RoomInfo from "./RoomInfo";

interface Props {}

const StreamButtons: React.FC<Props> = () => {
	const toast = useToast();
	const {
		localCameraEnabled,
		localMicrophoneEnabled,
		shareScreenEnabled,
		recordScreenEnabled,
	} = useAppSelector((state) => state.stream);
	const { newMessage } = useAppSelector((state) => state.message);
	const { isWhiteBoard, roomId } = useAppSelector(
		(state) => state.room.roomInfo
	);

	const dispatch = useAppDispatch();

	const onToggleChat = async () => {
		 await dispatch(setToggleShowChat());
		 await dispatch(updateLayout());
	};

	const buttons = [
		{
			tooltip: localMicrophoneEnabled
				? "Turn off microphone"
				: "Turn on microphone",
			onClick: toggleMic,
			icon: localMicrophoneEnabled ? IoMdMic : IoMdMicOff,
		},
		{
			tooltip: localCameraEnabled ? "Turn off camera" : "Turn on camera",
			onClick: toggleCamera,
			icon: localCameraEnabled ? IoVideocam : IoVideocamOff,
		},
		{
			tooltip: shareScreenEnabled ? "Stop share screen" : "Share screen",
			onClick: toggleShareScreen,
			icon: shareScreenEnabled ? MdStopScreenShare : MdScreenShare,
		},
		{
			tooltip: recordScreenEnabled
				? "Stop record this meeting"
				: "Record this meeting",
			onClick: toggleRecord,
			icon: recordScreenEnabled ? FaStopCircle : FaCircle,
		},
		{
			tooltip: isWhiteBoard ? "Stop whiteboard" : "Start whiteboard",
			onClick: toggleWhiteboard,
			icon: isWhiteBoard ? AiFillStop : RiArtboardFill,
		},
		{ tooltip: "Chat", onClick: onToggleChat, icon: BsChatFill },
		{ tooltip: "Hang up", onClick: leave, icon: FaPhoneAlt },
	];

	return (
		<Flex
			h="100px"
			bg="#1a1d28"
			justify="center"
			alignItems="center"
			position="relative"
		>
			<Text
				position="absolute"
				top="50%"
				left="2rem"
				color="#fff"
				fontSize="1.2rem"
				transform="translateY(-50%)"
				cursor="pointer"
				display={{ base: "none", "2xl": "block" }}
				onClick={() => {
					toast({
						description: "Copy to clipboard",
						status: "success",
						duration: 1000,
					});
					navigator.clipboard.writeText(roomId);
				}}
			>
				{roomId}
			</Text>
			<Stack direction="row" spacing={8}>
				{buttons.map(({ tooltip, icon, onClick }, i) => (
					<Tooltip
						label={tooltip}
						fontSize="md"
						aria-label="A tooltip"
						key={i}
					>
						<Flex
							justify="center"
							alignItems="center"
							h="4rem"
							w="4rem"
							borderRadius="50%"
							bg={
								i === buttons.length - 1 ? "red.600" : "#2e333e"
							}
							cursor="pointer"
							position="relative"
							onClick={onClick}
						>
							{tooltip === "Chat" && newMessage && (
								<Box
									position="absolute"
									h="1rem"
									w="1rem"
									borderRadius="50%"
									bg="red"
									top="15px"
									right="10px"
								/>
							)}
							<Icon as={icon} color="#fff" fontSize="1.5rem" />
						</Flex>
					</Tooltip>
				))}
			</Stack>
			<Box position="absolute" right="2rem">
				<Menu>
					<MenuButton>
						<Box
							as={HiDotsVertical}
							boxSize="1.5rem"
							color="#fff"
						/>
					</MenuButton>
					<MenuList>
						<RoomInfo />
						<InviteDialog />
					</MenuList>
				</Menu>
			</Box>
		</Flex>
	);
};

export default StreamButtons;
