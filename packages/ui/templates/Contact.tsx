import {
  Link,
  Icon,
  Textarea,
  useBreakpointValue,
  Divider,
  Progress,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { Box, Flex, Container, Text, Map, Button } from 'ui';
import { Field, Formik } from 'formik';
import { MdLocationOn } from 'react-icons/md';
import { FaPhoneAlt } from 'react-icons/fa';
import { BiSolidTime } from 'react-icons/bi';

import { validateEmpty, validateEmail } from 'shared';
import { useContactRequest } from 'shared/hooks/request/contact';
import { Contact as ContactValues } from 'shared/entities/contact';
import { useEffect, useState } from 'react';

import { branches } from 'shared/env';

const _firstBoxWidth = { base: '100%', lg: '20rem' };
const _secondBoxWidth = { base: '100%', lg: '25rem' };
const _left = { base: '0', lg: '12' };
const _right = { base: '0', lg: '12' };
const _top = { base: '0', lg: '60%' };
const _transform = { base: 'none', lg: 'translateY(-50%)' };
const _mb = { base: '8', lg: 'none' };

const calculateCenter = (branches: any) => {
  let lat = 0;
  let lng = 0;
  branches.forEach((branch: any) => {
    lat += branch.position.lat;
    lng += branch.position.lng;
  });
  return { lat: lat / branches.length, lng: lng / branches.length };
};

export const Contact = () => {
  const toast = useToast();
  const lg = useBreakpointValue({ base: false, lg: true });
  const [contactProps, setContactProps] = useState<ContactValues>();
  const { isLoading, data, error } = useContactRequest(contactProps);

  useEffect(() => {
    if (toast && data) {
      const id = 'contact-message-sent';
      if (!toast.isActive(id)) {
        toast({
          id,
          title: 'Mensaje enviado',
          description: 'El mensaje fue enviado correctamente.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  }, [toast, data]);

  const handleSubmit = async (values: ContactValues) => {
    setContactProps(values);
  };

  return (
    <>
      <Container px="0" minW="100%">
        <Box position={lg ? 'relative' : 'static'}>
          <Box w="100%">
            <Map
              position={branches.map(branch => branch.position)}
              zoom={lg ? 13 : 12}
              h={lg ? '100vh' : '50vh'}
              center={calculateCenter(branches)}
            />
          </Box>
          <Flex
            flexDir={'column'}
            fontWeight="medium"
            fontSize="1.25rem"
            bg="white"
            color="blackAlpha.700"
            p={6}
            borderRadius={16}
            boxShadow="2xl"
            w={_firstBoxWidth}
            position={lg ? 'absolute' : 'static'}
            left={_left}
            top={_top}
            transform={_transform}
            mb={_mb}
          >
            {branches.map((branch, index) => (
              <Flex key={index} gap={4} flexDir="column">
                {index != 0 && <Divider />}
                <Box>
                  <Link
                    href={branch.mapUrl}
                    target="_blank"
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    style={{ textDecoration: 'none' }}
                    _hover={{ color: 'blackAlpha.900' }}
                  >
                    <Box display="flex" alignItems="center">
                      <Icon as={MdLocationOn} w="2rem" h="3rem" boxSize={10} mr="0.5rem" color="primary.main" />
                      <Box w="100%">
                        <Text>{branch.address}</Text>
                        <Text fontSize={14}>{branch.addressDetail}</Text>
                      </Box>
                    </Box>
                  </Link>
                </Box>
                <Box display="flex" alignItems="center">
                  <Icon as={BiSolidTime} w="2rem" h="1.5rem" ml="0.25rem" mr="0.75rem" color="primary.main" />
                  <Text fontSize={16}>{branch.schedule}</Text>
                </Box>
                <Box
                  display="flex"
                  alignItems="center"
                  pb={index + 2 > branches.length ? 'none' : '1rem'}
                  fontSize="1.188rem"
                >
                  <Icon as={FaPhoneAlt} w="2rem" h="1.25rem" ml="0.25rem" mr="0.75rem" color="primary.main" />
                  {branch.phone.map((phone, index) => (
                    <Box display="flex" key={index}>
                      {index != 0 && <Text px="0.375rem"> - </Text>}
                      <Link
                        href={`tel:${phone.number}`}
                        rel="noopener noreferrer"
                        target="_blank"
                        style={{ textDecoration: 'none' }}
                        _hover={{ color: 'blackAlpha.900' }}
                      >
                        {phone.text}
                      </Link>
                    </Box>
                  ))}
                </Box>
              </Flex>
            ))}
          </Flex>
          <Box
            bg="white"
            color="blackAlpha.700"
            p={6}
            pt={4}
            borderRadius={16}
            boxShadow="2xl"
            w={_secondBoxWidth}
            position={lg ? 'absolute' : 'static'}
            right={_right}
            top={_top}
            transform={_transform}
            mb={_mb}
          >
            <Text fontSize="1.375rem" fontWeight="bold" mb="1.25rem">
              Contáctese con nosotros
            </Text>
            <Formik
              initialValues={{
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: '',
              }}
              onSubmit={handleSubmit}
              validateOnChange={false}
              validateOnBlur={false}
            >
              {({ handleSubmit, errors }) => (
                <form onSubmit={handleSubmit}>
                  <VStack spacing="1rem" align="flex-start">
                    <Box w="100%">
                      <FormControl isInvalid={!!errors.name} variant="floating">
                        <Field
                          as={Input}
                          id="name"
                          placeholder=" "
                          name="name"
                          type="text"
                          disabled={isLoading}
                          validate={(value: any) => {
                            return validateEmpty(value);
                          }}
                        />
                        <FormLabel>Nombre</FormLabel>
                      </FormControl>
                    </Box>
                    <Box w="100%">
                      <FormControl isInvalid={!!errors.email} variant="floating">
                        <Field
                          as={Input}
                          id="email"
                          name="email"
                          type="text"
                          placeholder=" "
                          disabled={isLoading}
                          validate={(value: any) => {
                            return validateEmail(value);
                          }}
                        />
                        <FormLabel>Correo electrónico</FormLabel>
                      </FormControl>
                    </Box>
                    <Box w="100%">
                      <FormControl isInvalid={!!errors.phone} variant="floating">
                        <Field
                          as={Input}
                          id="phone"
                          name="phone"
                          type="number"
                          placeholder=" "
                          disabled={isLoading}
                          validate={(value: any) => {
                            return validateEmpty(value);
                          }}
                        />
                        <FormLabel>Telefono</FormLabel>
                      </FormControl>
                    </Box>
                    <Box w="100%">
                      <FormControl isInvalid={!!errors.subject} variant="floating">
                        <Field
                          as={Input}
                          id="subject"
                          name="subject"
                          type="text"
                          placeholder=" "
                          disabled={isLoading}
                          validate={(value: any) => {
                            return validateEmpty(value);
                          }}
                        />
                        <FormLabel>Asunto</FormLabel>
                      </FormControl>
                    </Box>
                    <Box w="100%">
                      <FormControl isInvalid={!!errors.message} variant="floating">
                        <Field
                          as={Textarea}
                          id="message"
                          name="message"
                          type="text"
                          placeholder=" "
                          resize="none"
                          disabled={isLoading}
                          validate={(value: any) => {
                            return validateEmpty(value);
                          }}
                        />
                        <FormLabel>Mensaje</FormLabel>
                      </FormControl>
                    </Box>
                  </VStack>
                  {errors.message && (
                    <Text color="red.500" pt="0.75rem">
                      Debe completar todos los campos
                    </Text>
                  )}
                  <Box w="100%">
                    <Progress
                      h={isLoading ? '4px' : '1px'}
                      m="1rem 0"
                      size="xs"
                      isIndeterminate={isLoading}
                      colorScheme="primary"
                    />
                    <Button
                      type="submit"
                      bg="primary.main"
                      color="white"
                      width="100%"
                      mt={2}
                      _hover={{ backgroundColor: 'primary.main' }}
                    >
                      ENVIAR
                    </Button>
                  </Box>
                </form>
              )}
            </Formik>
          </Box>
        </Box>
      </Container>
    </>
  );
};
