import { useState } from 'react';
import { Box, Text } from 'ui';
import { Status } from 'shared/entities/status';
import { BoxProps, Select } from '@chakra-ui/react';
import { ModalStatus } from './ModalStatus';

type StatusProps = {
  orderId: string;
  status: Status;
  isEdit?: boolean;
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

export const OrderStatus = ({ orderId, status, isEdit }: StatusProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);
  const [tempStatus, setTempStatus] = useState<Status>(status);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value as Status);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedStatus(null);
    setIsModalOpen(false);
  };

  const handleModalConfirm = (newStatus: Status) => {
    setTempStatus(newStatus);
    setIsModalOpen(false);
  };

  const statusColor = colors[tempStatus] || { color: 'gray.800', bg: 'gray.100' };

  return (
    <>
      <Box px="0.5rem" py="0.25rem" bg={statusColor.bg} borderRadius="0.25rem">
        {isEdit ? (
          <Select
            size="sm"
            h="1.75rem"
            border="none"
            _focusVisible={{ border: 'none' }}
            value={tempStatus}
            color={statusColor.color}
            onChange={handleChange}
          >
            {Object.values(Status).map(value => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </Select>
        ) : (
          <Text color={statusColor.color}>{tempStatus}</Text>
        )}
      </Box>

      {selectedStatus && (
        <ModalStatus
          isOpen={isModalOpen}
          onClose={handleModalClose}
          orderId={orderId}
          status={selectedStatus}
          onConfirm={handleModalConfirm}
        />
      )}
    </>
  );
};
