import { Textarea, Progress, FormControl, FormLabel, Input, VStack, useToast, useBreakpointValue } from '@chakra-ui/react';
import { Box, Flex, Container, Text, Button, GaPage } from 'ui';
import { Field, Formik } from 'formik';

import { validateEmpty, validateEmail } from 'shared';
import { useContactRequest } from 'shared/hooks/request/contact';
import { Contact as ContactValues } from 'shared/entities/contact';
import { useEffect, useState } from 'react';
import { NextPage } from 'next';

const _secondBoxWidth = { base: '90%', lg: '25rem' };
const _mb = { base: '8', lg: 'none' };

const HomePage: NextPage = () => {
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
    <GaPage page="Home">
      <>
        <Flex
          h="100vh"
          justifyContent={{ base: 'center', lg: 'end' }}
          mr={{ base: '0', lg: '8rem' }}
          alignItems="center"
          backgroundImage="/buey.jpeg"
          backgroundRepeat="no-repeat"
          backgroundSize="contain"
        >
          <Box
            bg="white"
            color="blackAlpha.700"
            p={6}
            pt={4}
            borderRadius={16}
            boxShadow="2xl"
            w={_secondBoxWidth}
            position={lg ? 'absolute' : 'static'}
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
                    <Progress h={isLoading ? '4px' : '1px'} m="1rem 0" size="xs" isIndeterminate={isLoading} colorScheme="primary" />
                    <Button type="submit" bg="primary.main" color="white" width="100%" mt={2} _hover={{ backgroundColor: 'primary.main' }}>
                      ENVIAR
                    </Button>
                  </Box>
                </form>
              )}
            </Formik>
          </Box>
        </Flex>
      </>
    </GaPage>
  );
};

export default HomePage;
