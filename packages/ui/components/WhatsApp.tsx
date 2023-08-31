import { Box, Button, Text } from 'ui';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Icon,
  Link,
} from '@chakra-ui/react';
import { BiLogoWhatsapp, BiTimeFive } from 'react-icons/bi';
import { IoLocationSharp } from 'react-icons/io5';

export const WhatsApp = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button
        onClick={onOpen}
        pos={'fixed'}
        right={'1.5rem'}
        bottom={'1.5rem'}
        width={'3rem'}
        height={'3rem'}
        backgroundColor={'#47d040'}
        p={'2rem'}
        borderRadius={'50%'}
        _hover={{ backgroundColor: '#339b11' }}
        _active={{ color: 'white' }}
      >
        <Icon as={BiLogoWhatsapp} w={'3rem'} h={'3rem'} color={'white'} transition={'300ms'} />
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size={'xl'} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Contáctese con nosotros</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box mb={'1rem'} borderBottom={'1px'} borderColor={'blackAlpha.500'} pb={'1rem'}>
              <Box display={'flex'} alignItems={'center'} pb={'0.5rem'}>
                <Icon as={IoLocationSharp} boxSize={6} mr={'0.5rem'} />
                <Text display={'inline-block'} fontSize={'1.375rem'}>
                  Bvr. Artigas 3397
                </Text>
              </Box>
              <Box display={'flex'} alignItems={'center'} pb={'0.5rem'}>
                <Icon as={BiTimeFive} boxSize={6} mr={'0.5rem'} />
                <Text display={'inline-block'} fontSize={'1.125rem'}>
                  Lunes a Viernes: de 8:00 a 12:00 y de 13:30 a 18:30 hrs.
                </Text>
              </Box>
              <Box display={'flex'} alignItems={'center'}>
                <Icon as={BiLogoWhatsapp} boxSize={6} mr={'0.5rem'} />
                <Link
                  display={'inline-block'}
                  fontSize={'1.375rem'}
                  style={{ textDecoration: 'none' }}
                  _hover={{ color: '#339b11' }}
                >
                  098 000 600
                </Link>
              </Box>
            </Box>
            <Box pb={'1rem'}>
              <Box display={'flex'} alignItems={'center'} pb={'0.5rem'}>
                <Icon as={IoLocationSharp} boxSize={6} mr={'0.5rem'} />
                <Text display={'inline-block'} fontSize={'1.375rem'}>
                  Cerro Largo 1518
                </Text>
              </Box>
              <Box display={'flex'} alignItems={'center'} pb={'0.5rem'}>
                <Icon as={BiTimeFive} boxSize={6} mr={'0.5rem'} />
                <Text display={'inline-block'} fontSize={'1.125rem'}>
                  Lunes a Viernes: de 8:00 a 12:30 y de 13:30 a 18:00 hrs.
                </Text>
              </Box>
              <Box display={'flex'} alignItems={'center'}>
                <Icon as={BiLogoWhatsapp} boxSize={6} mr={'0.5rem'} />
                <Link
                  display={'inline-block'}
                  fontSize={'1.375rem'}
                  style={{ textDecoration: 'none' }}
                  _hover={{ color: '#339b11' }}
                >
                  091 033 282
                </Link>
              </Box>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
