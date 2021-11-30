import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
} from '@chakra-ui/react';
import 'react-leaf-polls/dist/index.css';

import { useAppSelector } from '../../../app/hooks';
import Poll from './Poll';

const PollDisplay = () => {
  const { isPolled, isVoted } = useAppSelector((state) => state.poll);

  const onClose = () => {};

  return (
    <>
      <Modal
        onClose={onClose}
        isOpen={isPolled && !isVoted}
        closeOnOverlayClick={false}
        closeOnEsc={false}
      >
        <ModalOverlay />
        <ModalContent as="form">
          <ModalHeader>Poll</ModalHeader>
          <ModalBody>
            <Poll />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PollDisplay;
