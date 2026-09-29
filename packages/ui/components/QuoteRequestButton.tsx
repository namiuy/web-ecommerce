import { Button } from 'ui';
import { ModalQuote } from './ModalQuote';
import { useDisclosure } from '@chakra-ui/react';
import { ProductActionProps } from '../templates/ProductDetail';
import { useCelesteStore } from 'shared';

const CELESTE_COLORS = ['#5CBCEB', '#FFFFFF', '#FCD116'];

const fireCelesteConfetti = async () => {
  if (typeof window === 'undefined') return;
  const confetti = (await import('canvas-confetti')).default;
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.7 },
    colors: CELESTE_COLORS,
  });
};

export const QuoteRequestButton = ({ product }: ProductActionProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const celesteEnabled = useCelesteStore(s => s.enabled);

  const handleClick = () => {
    if (celesteEnabled) fireCelesteConfetti();
    onOpen();
  };

  return (
    <>
      <Button width="full" isDisabled={!product} colorScheme="primary" onClick={handleClick}>
        Solicitar financiación
      </Button>
      {product && <ModalQuote isOpen={isOpen} product={product} onClose={onClose} />}
    </>
  );
};
