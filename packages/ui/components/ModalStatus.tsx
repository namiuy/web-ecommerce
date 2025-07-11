import { useEffect, useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Checkbox,
  Box,
  BoxProps,
  Spinner,
  Text,
  useToast,
} from '@chakra-ui/react';
import { Status } from 'shared/entities/status';
import { useStatusChange } from 'shared/hooks';
import { StatusChange } from 'shared/entities/status-change';

const colors: Record<Status, BoxProps> = {
  [Status.PENDING_PAYMENT]: { color: 'yellow.700', bg: 'yellow.100' },
  [Status.PROCESSING_PAYMENT]: { color: 'blue.800', bg: 'blue.100' },
  [Status.APPROVED_PAYMENT]: { color: 'green.800', bg: 'green.100' },
  [Status.INCOMPLETE_PAYMENT]: { color: 'red.800', bg: 'red.100' },
  [Status.CANCELED]: { color: 'black', bg: 'blackAlpha.200' },
  [Status.DISPATCHED]: { color: 'green.800', bg: 'green.100' },
};

type ModalStatusProps = {
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
  status: Status;
  onConfirm: (newStatus: Status, sendEmail: boolean) => void;
};

export const ModalStatus = ({ orderId, isOpen, onClose, status, onConfirm }: ModalStatusProps) => {
  const [sendEmail, setSendEmail] = useState(true);
  const [statusChangeValues, setStatusChangeValues] = useState<StatusChange | undefined>();
  const toast = useToast();

  const { isLoading, data, error } = useStatusChange(statusChangeValues);

  useEffect(() => {
    if (status === Status.CANCELED) {
      setSendEmail(false);
    } else {
      setSendEmail(true);
    }
  }, [status]);

  useEffect(() => {
    if (data) {
      const id = 'model-status-success';
      if (!toast.isActive(id)) {
        toast({
          id,
          title: 'Estado cambiado correctamente',
          position: 'bottom',
          status: 'success',
          duration: 4000,
          isClosable: true,
        });
      }
      onClose();
      setStatusChangeValues(undefined);
    }
  }, [data, onClose]);

  const handleConfirm = () => {
    onConfirm(status, sendEmail);
    setStatusChangeValues({ order_id: orderId, status, send_email: sendEmail });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Confirmar cambio de estado</ModalHeader>
        <ModalBody py="0">
          <Box
            bg={colors[status].bg}
            color={colors[status].color}
            py="0.75rem"
            textAlign="center"
            borderRadius="md"
            fontWeight="bold"
          >
            {status}
          </Box>
          {status !== Status.CANCELED && (
            <Checkbox mt={4} isChecked={sendEmail} onChange={e => setSendEmail(e.target.checked)}>
              Enviar email de notificación
            </Checkbox>
          )}
          {error && (
            <Text color="red.500" mt={2}>
              {error}
            </Text>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose} isDisabled={isLoading}>
            Cancelar
          </Button>
          <Button colorScheme="primary" onClick={handleConfirm} isDisabled={isLoading}>
            {isLoading ? <Spinner size="sm" /> : 'Confirmar'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
