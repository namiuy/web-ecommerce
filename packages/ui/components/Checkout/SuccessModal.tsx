import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  Flex,
  Icon,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { useCheckout } from 'shared';
import { BsFillCheckCircleFill } from 'react-icons/bs';
import { useRouter } from 'next/router';

type SuccessModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const SuccessModal = ({ isOpen, onClose }: SuccessModalProps) => {
  const router = useRouter();

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent w="fit-content" maxW="90%">
        <ModalBody>
          <Flex justifyContent="center" alignItems="center" flexDir="column" pt="1.5rem" pb="0.25rem">
            <Icon as={BsFillCheckCircleFill} color="green.500" w="3.25rem" h="3.25rem" />
            <Text fontSize="1.25rem" fontWeight="medium" pt="1rem" pb="0.25rem" textAlign="center">
              ¡La orden fue creada correctamente!
            </Text>
            <Text textAlign="center">En breve recibirás un correo con los detalles de tu compra.</Text>
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Flex flexDir={{ base: 'column', md: 'row' }} gap="0.5rem">
            <Button colorScheme="primary" onClick={() => router.push('/')}>
              VOLVER AL INICIO
            </Button>
            <Button colorScheme="primary" onClick={() => router.push('/mis-compras')} ml={3}>
              VER MIS COMPRAS
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
