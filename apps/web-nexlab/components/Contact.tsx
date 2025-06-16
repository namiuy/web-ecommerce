'use client';

import { FormControl, Input, FormLabel, Textarea, Progress, useToast } from '@chakra-ui/react';
import { Formik, Field } from 'formik';
import { useEffect, useState } from 'react';
import { validateEmpty, validateEmail } from 'shared';
import { useContactRequest } from 'shared/hooks/request/contact';
import { Contact as ContactValues } from 'shared/entities/contact';
import { Box, Button, Container, Flex, Grid, Text, GridItem } from 'ui';

export const Contact = () => {
  const toast = useToast();
  const [contactProps, setContactProps] = useState<ContactValues & { resetForm?: () => void }>();
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
      contactProps?.resetForm?.();
    }
  }, [toast, data, contactProps]);

  const handleSubmit = async (values: ContactValues, { resetForm }: { resetForm: () => void }) => {
    setContactProps({ ...values, resetForm });
  };

  return (
    <Container maxW="container.xl" px={4}>
      <Flex justifyContent="space-between" alignItems="center" flexDir={{ base: 'column', lg: 'row' }} gap="2rem" py="2rem">
        <Text fontSize={{ base: '2rem', lg: '3rem' }} maxW="30rem" fontWeight="bold" lineHeight="3.25rem" textAlign={{ base: 'center', lg: 'left' }}>
          Cuéntanos cómo podemos ayudarte.
        </Text>
        <Box bg="white" p="2.5rem" borderRadius="1rem" w={{ base: '100%', lg: '50%' }}>
          <Formik
            initialValues={{
              name: '',
              email: '',
              phone: '',
              subject: '',
              message: '',
            }}
            onSubmit={handleSubmit}
            validateOnChange={true}
            validateOnBlur={false}
          >
            {({ handleSubmit, errors, touched }) => (
              <form onSubmit={handleSubmit}>
                <Grid
                  gridTemplateAreas={{
                    base: "'a' 'b' 'c' 'd' 'e'",
                    lg: "'a b' 'c d' 'e e'",
                  }}
                  gridTemplateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }}
                  rowGap={{ base: '1.5rem', lg: '2.5rem' }}
                  columnGap="2rem"
                  w="100%"
                >
                  <GridItem w="100%" gridArea="a">
                    <FormLabel fontSize="0.875rem">Nombre completo</FormLabel>
                    <FormControl isInvalid={!!errors.name && touched.name}>
                      <Field
                        as={Input}
                        id="name"
                        name="name"
                        type="text"
                        bg="#f5f5f7"
                        borderColor="#f5f5f7"
                        fontSize="0.875rem"
                        py="1.25rem"
                        disabled={isLoading}
                        validate={validateEmpty}
                      />
                    </FormControl>
                  </GridItem>

                  <GridItem w="100%" gridArea="b">
                    <FormLabel fontSize="0.875rem">Correo electrónico</FormLabel>
                    <FormControl isInvalid={!!errors.email && touched.email}>
                      <Field
                        as={Input}
                        id="email"
                        name="email"
                        type="text"
                        bg="#f5f5f7"
                        borderColor="#f5f5f7"
                        fontSize="0.875rem"
                        py="1.25rem"
                        disabled={isLoading}
                        validate={validateEmail}
                      />
                    </FormControl>
                  </GridItem>

                  <GridItem w="100%" gridArea="c">
                    <FormLabel fontSize="0.875rem">Teléfono</FormLabel>
                    <FormControl isInvalid={!!errors.phone && touched.phone}>
                      <Field
                        as={Input}
                        id="phone"
                        name="phone"
                        type="number"
                        bg="#f5f5f7"
                        borderColor="#f5f5f7"
                        fontSize="0.875rem"
                        py="1.25rem"
                        disabled={isLoading}
                        validate={validateEmpty}
                      />
                    </FormControl>
                  </GridItem>

                  <GridItem w="100%" gridArea="d">
                    <FormLabel fontSize="0.875rem">Asunto</FormLabel>
                    <FormControl isInvalid={!!errors.subject && touched.subject}>
                      <Field
                        as={Input}
                        id="subject"
                        name="subject"
                        type="text"
                        bg="#f5f5f7"
                        borderColor="#f5f5f7"
                        fontSize="0.875rem"
                        py="1.25rem"
                        disabled={isLoading}
                        validate={validateEmpty}
                      />
                    </FormControl>
                  </GridItem>

                  <GridItem w="100%" gridArea="e">
                    <FormLabel fontSize="0.875rem">Mensaje</FormLabel>
                    <FormControl isInvalid={!!errors.message && touched.message}>
                      <Field
                        as={Textarea}
                        id="message"
                        name="message"
                        type="text"
                        resize="none"
                        bg="#f5f5f7"
                        borderColor="#f5f5f7"
                        fontSize="0.875rem"
                        pt="0.75rem"
                        disabled={isLoading}
                        validate={validateEmpty}
                      />
                    </FormControl>
                  </GridItem>
                </Grid>
                {errors.message && touched.message && (
                  <Text color="red.500" pt="0.75rem">
                    Debe completar todos los campos
                  </Text>
                )}
                <Box w="100%" textAlign="center" mt="1.5rem">
                  {/* <Progress h={isLoading ? '4px' : '1px'} size="xs" isIndeterminate={isLoading} /> */}
                  <Button type="submit" bg="#0071e3" color="white" mt="1.5rem" py="1.5rem" px="2rem" _hover={{ bg: '#005bb5' }}>
                    Enviar mensaje
                  </Button>
                </Box>
              </form>
            )}
          </Formik>
        </Box>
      </Flex>
    </Container>
  );
};
