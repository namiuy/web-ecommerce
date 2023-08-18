import { Button } from 'ui';
import { FC } from 'react';
import { ModalQuote } from './ModalQuote';
import { useDisclosure } from '@chakra-ui/react';
import { ProductActionProps } from '../templates/ProductDetail';

export const QuoteRequestButton: FC<ProductActionProps> = ({ product }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button width="full" isDisabled={!product} colorScheme="primary" onClick={onOpen}>
        Solicitar financiación
      </Button>
      {product && <ModalQuote isOpen={isOpen} product={product} onClose={onClose} />}
    </>
  );
};
