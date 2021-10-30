import {
	Box,
	Button,
	Flex,
	ListItem,
	MenuItem,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Text,
	UnorderedList,
	useDisclosure,
	useToast,
} from "@chakra-ui/react";
import React from "react";
import { AiOutlineCopy } from "react-icons/ai";
import { BsFillInfoCircleFill } from "react-icons/bs";
import { useAppSelector } from "../../../app/hooks";

interface Props {}

const RoomInfo: React.FC<Props> = () => {
	const toast = useToast();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { hostName, roomId, roomName, password } = useAppSelector(
		(state) => state.room.roomInfo
	);
	return (
		<>
			<MenuItem
				icon={<BsFillInfoCircleFill size="1rem" color="primary" />}
				onClick={onOpen}
			>
				Room Info
			</MenuItem>

			<Modal isOpen={isOpen} onClose={onClose} size="3xl">
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Room Info</ModalHeader>
					<ModalCloseButton />
					<ModalBody p="0px 40px 20px 40px">
						<Flex
							bg="gray.200"
							p="15px 10px"
							borderRadius="8px"
							justify="space-between"
							alignItems="center"
							mb="1rem"
						>
							<Text>
								{`http://localhost:3000/guest-waiting/${roomId}`}
							</Text>
							<Button
								bg="primary"
								color="#fff"
								onClick={() => {
									toast({
										description: "Copy to clipboard",
										status: "success",
										duration: 1000,
									});
									navigator.clipboard.writeText(
										`http://localhost:3000/guest-waiting/${roomId}`
									);
								}}
							>
								<Box as={AiOutlineCopy} />
							</Button>
						</Flex>
						<UnorderedList spacing={4}>
							<ListItem>
								<Text>
									Room name: <strong>{roomName}</strong>
								</Text>
							</ListItem>
							<ListItem>
								<Text>
									Host name: <strong>{hostName}</strong>
								</Text>
							</ListItem>
							<ListItem>
								<Text>
									Room ID: <strong>{roomId}</strong>
								</Text>
							</ListItem>
							<ListItem>
								<Text>
									Password: <strong>{password}</strong>
								</Text>
							</ListItem>
						</UnorderedList>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};

export default RoomInfo;
