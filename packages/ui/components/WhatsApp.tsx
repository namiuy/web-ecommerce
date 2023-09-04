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
import { branches } from 'shared';

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
            {branches.map((branch, index) => (
              <Box
                key={index}
                pb={'1rem'}
                style={{ borderTop: index !== 0 ? '1px solid black' : 'none', paddingTop: index !== 0 ? '1rem' : '0' }}
              >
                <Box
                  display={'flex'}
                  alignItems={'center'}
                  _hover={{ color: 'red.600' }}
                  width={'fit-content'}
                  pb={'0.5rem'}
                >
                  <Icon as={IoLocationSharp} boxSize={6} mr={'0.5rem'} />
                  <Link
                    href={branch.location}
                    target="_blank"
                    style={{ textDecoration: 'none' }}
                    display={'inline-block'}
                    fontSize={'1.375rem'}
                  >
                    {branch.address}{' '}
                  </Link>
                </Box>
                <Box display={'flex'} alignItems={'center'} pb={'0.5rem'}>
                  <Icon as={BiTimeFive} boxSize={6} mr={'0.5rem'} />
                  <Text display={'inline-block'} fontSize={'1.125rem'}>
                    {branch.schedule}
                  </Text>
                </Box>
                <Box display={'flex'} alignItems={'center'} _hover={{ color: '#339b11' }} width={'fit-content'}>
                  <Icon as={BiLogoWhatsapp} boxSize={6} mr={'0.5rem'} />
                  <Link
                    href={`https://wa.me/${branch.whatsApp.number}`}
                    target="_blank"
                    display={'inline-block'}
                    fontSize={'1.375rem'}
                    style={{ textDecoration: 'none' }}
                    _hover={{ color: '#339b11' }}
                  >
                    {branch.whatsApp.text}
                  </Link>
                </Box>
              </Box>
            ))}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
