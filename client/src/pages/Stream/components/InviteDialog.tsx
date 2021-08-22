import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  MenuItem,
  useToast,
} from "@chakra-ui/react";
import emailjs from "emailjs-com";
import React, { useRef, useState } from "react";
import { MdEmail } from "react-icons/md";
import { RiUserAddFill } from "react-icons/ri";
import { useAppSelector } from "../../../app/hooks";

interface Props {}

const InviteDialog: React.FC<Props> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef(null);
  const [value, setValue] = useState("");
  const [isInvite, setIsInvite] = useState(false);
  const toast = useToast();

  const { roomId, password } = useAppSelector((state) => state.room.roomInfo);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendEmail(value);
  };

  const sendEmail = async (to: string) => {
    setIsInvite(true);
    try {
      // TODO: Tweak the params
      const res = await emailjs.send(
        process.env.REACT_APP_EMAILJS_SERVICE!,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID!,
        {
          to_mail: to,
          from_name: "haitran",
          url: `http://localhost:3000/guest-waiting/${roomId}`,
          roomId,
          roomPassword: password ? password : "none",
        },
        process.env.REACT_APP_EMAILJS_USER_ID
      );
      showToastAfterInviteSuccess();
      setValue("");
    } catch (error) {
      console.log(error);
    }
    setIsInvite(false);
    onClose();
  };

  const showToastAfterInviteSuccess = () => {
    toast({
      position: "top",
      description: "Email has been sent to the user",
      status: "success",
      duration: 1000,
    });
  };

  return (
    <>
      <MenuItem
        icon={<RiUserAddFill size="1rem" color="primary" />}
        onClick={onOpen}
      >
        Invite
      </MenuItem>

      {/* Dialog */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent as="form" onSubmit={onSubmit}>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Invite user via mail
            </AlertDialogHeader>
            <AlertDialogCloseButton />

            <AlertDialogBody>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<MdEmail style={{ color: "#cfd5e0" }} />}
                />
                <Input
                  type="email"
                  placeholder="Enter email..."
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
              </InputGroup>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                bg="primary"
                color="#fff"
                ml={3}
                isLoading={isInvite}
                loadingText="Invite"
              >
                Invite
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default InviteDialog;
