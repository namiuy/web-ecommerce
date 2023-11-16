import { useDisclosure, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, Box } from '@chakra-ui/react';
import { Image } from 'ui';

const _grey0 = 'brand.grey.0';

type ImageModalProps = {
  image: string;
  title: string;
  isMobile: boolean;
};

const OverlayDesktop = () => <Box position="absolute" top="0" left="0" w="100%" h="100%" bg="blackAlpha.800" />;
const OverlayMobile = () => <Box position="absolute" top="0" left="0" w="100%" h="100%" bg="blackAlpha.900" />;

export const ImageModal = (props: ImageModalProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Image
        w={'100%'}
        onClick={onOpen}
        src={props.image}
        alt={props.title}
        cursor={'pointer'}
        fallback={<Box w="100%" h="100%" bg={_grey0} />}
      />
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        {props.isMobile ? <OverlayMobile /> : <OverlayDesktop />}
        <ModalContent maxW={props.isMobile ? '100%' : '50%'}>
          <ModalCloseButton />
          <ModalBody mx={'auto'}>
            <Image src={props.image} alt={props.title} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
