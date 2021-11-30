import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  Box,
  Heading,
  InputGroup,
  InputRightElement,
  Input,
  useToast,
} from '@chakra-ui/react';
import { useFieldArray, useForm } from 'react-hook-form';
import { FaTrash } from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { setPollData, voted } from '../../../features/poll/pollSlice';
import { sendvote } from '../../../utils/webSocket';

interface Props {
  //   question: string;
  //   answers: Answer[];
}

// interface Answer {
//   option: string;
//   votes: number;
// }

const Poll: React.FC<Props> = () => {
  const { question, answers } = useAppSelector((state) => state.poll);
  const dispatch = useAppDispatch();
  const toast = useToast();

  const onVote = (answer: string) => {
    toast({
      description: 'Voted Successfully',
      status: 'success',
      position: 'top',
    });

    dispatch(voted());
    sendvote(answer);
  };

  return (
    <Box>
      <Heading fontSize="md" mb="0.5rem">
        {question}
      </Heading>
      {answers.map((answer) => (
        <Box
          p="10px 20px"
          bg="#f3f3f3"
          mb="0.5rem"
          borderRadius="6px"
          cursor="pointer"
          _hover={{
            background: 'teal.500',
            color: 'white',
          }}
          transition="350ms all"
          onClick={() => onVote(answer.option)}
        >
          {answer.option}
        </Box>
      ))}
    </Box>
  );
};

export default Poll;
