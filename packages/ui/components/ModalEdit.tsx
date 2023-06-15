import {
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { FC, ReactNode } from 'react';
import { MdEdit } from 'react-icons/md';

const _backgroundColor = 'rgba(0, 0, 0, .6)';
const _backdropFilter = 'saturate(180%) blur(6px)';

type ModalEditProps = {
  title: string;
  children: ReactNode;
};

export const ModalEdit: FC<ModalEditProps> = ({ title, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <IconButton pos="absolute" aria-label="" bg="none" icon={<MdEdit />} onClick={onOpen} _hover={{ bg: 'none' }} />
      <Modal isCentered isOpen={isOpen} size="6xl" scrollBehavior="inside" onClose={onClose}>
        <ModalOverlay bg={_backgroundColor} backdropFilter={_backdropFilter} />
        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody p="0">{children}</ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
