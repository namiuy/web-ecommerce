import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
} from '@chakra-ui/react';

type ConfirmDeleteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemType: string;
};

export const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, itemType }: ConfirmDeleteModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Confirmar eliminación</ModalHeader>
        <ModalBody>
          <Text>¿Estás seguro de que deseas eliminar este {itemType}?</Text>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="gray" onClick={onClose}>
            Cancelar
          </Button>
          <Button colorScheme="primary" ml={3} onClick={onConfirm}>
            Confirmar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
