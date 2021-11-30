import {
  Box,
  Button,
  Input,
  InputGroup,
  InputRightElement,
  MenuItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Heading,
  Text,
  Flex,
} from '@chakra-ui/react';
import { init } from 'emailjs-com';
import React, { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { FaPoll, FaTrash } from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  clearPollData,
  hostOnlySetPollData,
} from '../../../features/poll/pollSlice';
import { sendPollData } from '../../../utils/webSocket';

interface Props {}
type Inputs = {
  question: string;
  answers: Answer[];
};

type Answer = {
  option: string;
  votes: number;
};

const PollDialog: React.FC<Props> = () => {
  const [isShowResult, setIsShowResult] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { question, answers } = useAppSelector((state) => state.poll);
  const dispatch = useAppDispatch();

  const { register, handleSubmit, control, reset } = useForm<Inputs>({
    defaultValues: {
      answers: [{ option: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: 'answers' as never,
    control,
  });

  useEffect(() => {
    setTotal(countTotalVotes());
  }, [answers]);

  const onSubmit = (data: Inputs) => {
    setIsShowResult(true);

    data.answers = data.answers.map((answer) => ({
      option: answer.option,
      votes: 0,
    }));

    dispatch(hostOnlySetPollData(data));
    sendPollData(data);
    reset();
  };

  const onReset = () => {
    setIsShowResult(false);
    dispatch(clearPollData());
    onClose();
  };

  const countTotalVotes = () => {
    return answers.reduce((init, accum) => init + accum.votes, 0);
  };

  const percentage = (answer: Answer) => {
    const per = parseFloat(((answer.votes / total) * 100).toFixed(2));
    return isNaN(per) ? 0 : per;
  };

  return (
    <>
      <MenuItem icon={<FaPoll size="1rem" color="primary" />} onClick={onOpen}>
        Create a poll
      </MenuItem>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        closeOnOverlayClick={false}
        closeOnEsc={false}
      >
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>{isShowResult ? 'Poll Result' : 'Poll'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {isShowResult ? (
              <Box>
                <Heading fontSize="md" mb="1rem">
                  {question}
                </Heading>
                {answers.map((answer) => (
                  <Box
                    bg="#f3f3f3"
                    mb="0.5rem"
                    borderRadius="6px"
                    cursor="pointer"
                    transition="350ms all"
                    position="relative"
                    minHeight="40px"
                  >
                    <Box
                      position="absolute"
                      top="0"
                      left="0"
                      h="100%"
                      w={answer.votes === 0 ? '0%' : percentage(answer) + '%'}
                      bg="#00f5de"
                      borderRadius="6px"
                    ></Box>
                    <Flex
                      position="absolute"
                      top="0"
                      left="0"
                      h="100%"
                      w="100%"
                      justifyContent="space-between"
                      alignItems="center"
                      p="0 15px"
                    >
                      <Text> {answer.option}</Text>
                      <Text>{percentage(answer) + '%'}</Text>
                    </Flex>
                  </Box>
                ))}
                <Text>Total Votes: {total}</Text>
              </Box>
            ) : (
              <>
                <Box mb="8">
                  <Box as="label">Question: </Box>
                  <Input {...register('question', { required: true })} />
                </Box>

                <Box>
                  <Box as="label">Answer: </Box>
                  <Button
                    size="sm"
                    colorScheme="teal"
                    onClick={() =>
                      append({ content: '', id: fields.length + 1 })
                    }
                    mb="4"
                  >
                    +
                  </Button>
                  {fields.map((field, index) => (
                    <InputGroup>
                      <Input
                        {...register(`answers.${index}.option` as const, {
                          required: true,
                        })}
                        autoComplete="off"
                        mb="4"
                      />
                      <InputRightElement
                        children={<FaTrash />}
                        onClick={() => remove(index)}
                      />
                    </InputGroup>
                  ))}
                </Box>
              </>
            )}
          </ModalBody>

          <ModalFooter>
            {isShowResult ? (
              <Button background="primary" color="#fff" onClick={onReset}>
                Reset
              </Button>
            ) : (
              <Button background="primary" color="#fff" type="submit">
                Send
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PollDialog;
