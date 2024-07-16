import { Modal, ModalBody, ModalCloseButton, ModalContent, UseDisclosureReturn, ModalOverlay } from '@chakra-ui/react';
import { Image } from 'ui';

const _backgroundColor = 'blackAlpha.800';
const _backgroundColorMobile = 'blackAlpha.900';
const _backdropFilter = 'saturate(180%) blur(6px)';

type ImageModalProps = {
  disclosure: UseDisclosureReturn;
  image?: string;
  title?: string;
  isMobile?: boolean;
};

export const ImageModal = ({ disclosure, image, title, isMobile }: ImageModalProps) => {
  return (
    <>
      <Image
        w="100%"
        onClick={disclosure.onOpen}
        src={image}
        alt={title}
        cursor="pointer"
        style={{ objectFit: 'contain' }}
      />
      <Modal isOpen={disclosure.isOpen} onClose={disclosure.onClose} isCentered>
        <ModalOverlay bg={isMobile ? _backgroundColorMobile : _backgroundColor} backdropFilter={_backdropFilter} />
        <ModalContent maxW={isMobile ? '100%' : '50%'}>
          <ModalCloseButton />
          <ModalBody display="flex" justifyContent="center">
            <Image src={image} alt={title} maxH="80vh" />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
