import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import { FC } from 'react';
import { Product } from 'shared/entities/product';
import { FileUpload } from './FileUpload';

const _backgroundColor = 'rgba(0, 0, 0, .6)';
const _backdropFilter = 'saturate(180%) blur(6px)';

type ModalQuoteProps = {
  isOpen: boolean;
  product: Product;
  onClose: () => void;
};

export const ModalQuote: FC<ModalQuoteProps> = ({ isOpen, product, onClose }) => (
  <Modal isOpen={isOpen} size="5xl" onClose={onClose}>
    <ModalOverlay bg={_backgroundColor} backdropFilter={_backdropFilter} />
    <ModalContent>
      <ModalHeader>XXXXXX</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <FileUpload />
        {/* <Button>Solicitar</Button> */}
      </ModalBody>
    </ModalContent>
  </Modal>
);
