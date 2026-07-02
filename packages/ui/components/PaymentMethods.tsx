import { Flex, Image } from 'ui';
import { usePaymentMethods } from 'shared';

export const PaymentMethods = () => {
  const paymentMethods = usePaymentMethods();

  return (
    <Flex gap="1.25rem" justifyContent="center" alignItems="center" flexWrap="wrap">
      {paymentMethods.map((method, i) => (
        <Image
          key={i}
          src={`/assets/payment-methods/${method.id}-white.svg`}
          alt={method.name}
          w="6rem"
          h="2.5rem"
          objectFit="contain"
        />
      ))}
    </Flex>
  );
};
