import { Stack, Heading, Flex, Button, Text } from 'ui';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  StackDivider,
  Icon,
  Link,
} from '@chakra-ui/react';
import { BiLogoWhatsapp } from 'react-icons/bi';
import { getBranches } from 'shared';

const _grey3 = 'brand.grey.3';
const _backgroundColor = '#00ea81';
const _hoverBackgroundColor = '#25D366';

export const WhatsApp = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const branches = getBranches();

  return (
    <>
      <Button
        onClick={onOpen}
        pos="fixed"
        right="1rem"
        bottom="1rem"
        width="2rem"
        height="2rem"
        p="1.75rem"
        borderRadius="50%"
        zIndex="999"
        backgroundColor={_backgroundColor}
        _hover={{ backgroundColor: _hoverBackgroundColor }}
        _active={{ color: 'white' }}
      >
        <Icon as={BiLogoWhatsapp} w="2.5rem" h="2.5rem" color="white" transition="300ms" />
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            color={_grey3}
            pb="0.25rem"
            paddingInlineStart={{ base: '0.75rem', sm: '1.5rem' }}
            paddingInlineEnd={{ base: '0.75rem', sm: '1.5rem' }}
          >
            Contáctese con nosotros
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            pb="1.5rem"
            paddingInlineStart={{ base: '0.75rem', sm: '1.5rem' }}
            paddingInlineEnd={{ base: '0.75rem', sm: '1.5rem' }}
          >
            <Stack divider={<StackDivider />} spacing="4">
              {branches.map((branch, index) => (
                <Flex flexDirection="column" gap="0.25rem" key={index}>
                  <Link
                    href={`https://wa.me/${branch.whatsApp.number}`}
                    target="_blank"
                    _hover={{ color: _backgroundColor }}
                  >
                    <Heading size="lg" textTransform="uppercase">
                      <Flex align="center" gap="0.5rem">
                        <Icon as={BiLogoWhatsapp} />
                        {branch.whatsApp.text}
                      </Flex>
                    </Heading>
                  </Link>
                  <Text fontSize="lg" color={_grey3}>
                    {branch.location}
                  </Text>
                  <Text fontSize={{ base: 'xs', sm: 'sm' }} color={_grey3}>
                    {branch.address}
                  </Text>
                  <Text fontSize={{ base: 'xs', sm: 'sm' }} color={_grey3}>
                    {branch.schedule}
                  </Text>
                </Flex>
              ))}
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
