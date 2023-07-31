import { useDisclosure, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay } from '@chakra-ui/react';
import { Image } from 'ui';

type ImageModalProps = {
  image: string;
  title: string;
};

export const ImageModal = (props: ImageModalProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Image onClick={onOpen} src={props.image} alt={props.title} cursor={'pointer'} />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxW={'70%'}>
          <ModalCloseButton />
          <ModalBody mx={'auto'}>
            <Image src={props.image} alt={props.title} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
