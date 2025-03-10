import { Box, Text } from 'ui';
import { Status } from 'shared/entities/status';
import { BoxProps } from '@chakra-ui/react';

type StatusProps = {
  status: Status;
};

// function getKeyByValue(value: string): string | undefined {
//   return (Object.keys(Status) as Array<keyof typeof Status>).find(key => Status[key] === value);
// }

const colors: Record<Status, BoxProps> = {
  [Status.PENDING_PAYMENT]: { color: 'yellow.700', bg: 'yellow.100' },
  [Status.PROCESSING_PAYMENT]: { color: 'blue.800', bg: 'blue.100' },
  [Status.APPROVED_PAYMENT]: { color: 'green.800', bg: 'green.100' },
  [Status.INCOMPLETE_PAYMENT]: { color: 'red.800', bg: 'red.100' },
  [Status.CANCELED]: { color: 'black', bg: 'blackAlpha.200' },
  [Status.DISPATCHED]: { color: 'green.800', bg: 'green.100' },
};

export const OrderStatus = ({ status }: StatusProps) => {
  return (
    <Box px="0.5rem" py="0.25rem" bg={colors[status].bg} borderRadius="0.25rem">
      <Text color={colors[status].color}>{status}</Text>
    </Box>
  );
};
