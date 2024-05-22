import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import { ReactNode } from 'react';

const _backgroundColor = 'rgba(0, 0, 0, .6)';
const _backdropFilter = 'saturate(180%) blur(6px)';

type ModalEditProps = {
  isOpen: boolean;
  title?: string;
  scrollBehavior?: 'outside' | 'inside';
  children: ReactNode;
  onOpen: () => void;
  onClose: () => void;
};

export const ModalEdit = ({ isOpen, title, scrollBehavior = 'outside', children, onClose }: ModalEditProps) => (
  <Modal isOpen={isOpen} scrollBehavior={scrollBehavior} size="5xl" onClose={onClose}>
    <ModalOverlay bg={_backgroundColor} backdropFilter={_backdropFilter} />
    <ModalContent>
      {title && <ModalHeader>{title}</ModalHeader>}
      <ModalCloseButton />
      <ModalBody p="0">{children}</ModalBody>
    </ModalContent>
  </Modal>
);
