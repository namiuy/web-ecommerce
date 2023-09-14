import { useDisclosure, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, Box } from '@chakra-ui/react';
import { Image } from 'ui';

const _grey0 = 'brand.grey.0';

type ImageModalProps = {
  image: string;
  title: string;
};

export const ImageModal = (props: ImageModalProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Image
        onClick={onOpen}
        src={props.image}
        alt={props.title}
        cursor={'pointer'}
        fallback={<Box w="100%" h="100%" bg={_grey0} />}
      />
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
