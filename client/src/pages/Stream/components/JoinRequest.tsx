import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import React, { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { dequeueJoinRequests } from "../../../features/room/roomSlice";
import { answerRequestToJoin } from "../../../utils/webSocket";

interface Props {}

const JoinRequest: React.FC<Props> = () => {
  const { joinRequests } = useAppSelector((state) => state.room.roomInfo);
  const [isOpen, setIsOpen] = React.useState(false);
  const dispatch = useAppDispatch();
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (joinRequests.length > 0) {
      setIsOpen(true);
    }
  }, [joinRequests]);

  const processJoinRequest = (isAccepted: boolean) => {
    onClose();
    answerRequestToJoin({ socketId: joinRequests[0].socketId, isAccepted });
    dispatch(dequeueJoinRequests());
  };

  return (
    <>
      {joinRequests[0] && (
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Join Room Request
              </AlertDialogHeader>

              <AlertDialogBody>
                {joinRequests[0].username} requests to join your room.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button
                  variant="ghost"
                  ref={cancelRef}
                  onClick={() => processJoinRequest(false)}
                >
                  Decline
                </Button>
                <Button
                  colorScheme="teal"
                  onClick={() => processJoinRequest(true)}
                  ml={3}
                >
                  Accept
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      )}
    </>
  );
};

export default JoinRequest;
