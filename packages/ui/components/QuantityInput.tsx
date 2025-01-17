import { useState } from 'react';
import { Input, Flex, IconButton } from '@chakra-ui/react';
import { FaMinus, FaPlus } from 'react-icons/fa';

type QuantityInputProps = {
  initialQuantity?: number;
  onQuantityChange: (quantity: number) => void;
  isDisabled?: boolean;
};

export const QuantityInput = ({ initialQuantity = 1, onQuantityChange, isDisabled }: QuantityInputProps) => {
  const [quantity, setQuantity] = useState(initialQuantity);

  const increment = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    onQuantityChange(newQuantity);
  };

  const decrement = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onQuantityChange(newQuantity);
    }
  };

  return (
    <Flex align="center" border="1px" borderColor="blackAlpha.300" borderRadius="0.5rem" px="0.375rem" w="fit-content">
      <IconButton
        icon={<FaMinus />}
        color={quantity === 1 ? 'blackAlpha.300' : 'black'}
        size="xs"
        onClick={decrement}
        aria-label="Decrement"
        bg="transparent"
        _hover={{ bg: 'transparent' }}
        isDisabled={isDisabled}
      />
      <Input
        value={quantity}
        readOnly
        textAlign="center"
        width={{ base: '2rem', md: '3rem' }}
        size={{ base: 'xs', md: 'sm' }}
        border="none"
      />{' '}
      <IconButton
        icon={<FaPlus />}
        color="black"
        size="xs"
        onClick={increment}
        aria-label="Increment"
        bg="transparent"
        _hover={{ bg: 'transparent' }}
        isDisabled={isDisabled}
      />
    </Flex>
  );
};
