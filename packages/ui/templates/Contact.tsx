import { Link, Icon, Textarea, useBreakpointValue, FormErrorMessage } from '@chakra-ui/react';
import { Box, Container, Text, Map, Grid, GridItem, Button } from 'ui';
import { Field, Formik, useFormik } from 'formik';
import { FormControl, FormLabel, Input, VStack } from '@chakra-ui/react';
import { MdLocationOn } from 'react-icons/md';
import { FaPhoneAlt } from 'react-icons/fa';
import { BiSolidTime } from 'react-icons/bi';
import { MdOutlineNavigateNext } from 'react-icons/md';

import { validateEmpty, validateEmail } from 'shared';
import { useContactRequest } from 'shared/hooks/request/contact';
import { Contact as contact } from 'shared/entities/contact';
import { useState } from 'react';

import { branches } from 'shared/env';

const _firstBoxWidth = { base: '100%', lg: '20rem' };
const _secondBoxWidth = { base: '100%', lg: '25rem' };
const _left = { base: '0', lg: '12' };
const _right = { base: '0', lg: '12' };
const _top = { base: '0', lg: '50%' };
const _transform = { base: 'none', lg: 'translateY(-50%)' };
const _mb = { base: '8', lg: 'none' };

const info = [
  {
    address: 'Bvar Artgias 3397',
    detalle: 'Casi Gral Flores',
    location: 'https://goo.gl/maps/8XcU2MwL8H1Z6j8N8',
    schedule: 'Lunes a Viernes: de 8:00 a 12:00 y de 13:30 a 18:30 hrs.',
    phone: '2200 1350 - 2203 4381',
    position: { lat: -34.8704995, lng: -56.17636 },
  },
  {
    address: 'Cerro Largo 1518',
    detalle: 'Esq. Piedra Alta.',
    location: 'https://goo.gl/maps/8XcU2MwL8H1Z6j8N8',
    schedule: 'Lunes a Viernes: de 8:00 a 12:30 y de 13:30 a 18:00 hrs.',
    phone: '2402 0922 - 2402 0031',
    position: { lat: -34.9001314, lng: -56.1847301 },
  },
];

export const Contact = () => {
  const lg = useBreakpointValue({ base: false, lg: true });
  const [contactProps, setContactProps] = useState<contact>();
  const { isLoading, data, error } = useContactRequest(contactProps);

  {
    data && console.log('Se ha registrado exitosamente!');
  }

  return (
    <>
      <Container px="0" minW="100%">
        <Box position={lg ? 'relative' : 'static'}>
          <Box w="100%">
            <Map
              position={branches.map(item => item.position)}
              zoom={lg ? 13 : 12}
              h={lg ? '92vh' : '50vh'}
              center={{ lat: -34.89054118139598, lng: -56.17411952377538 }}
            />
          </Box>
          <Grid
            gap={4}
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
              <>
                <GridItem>
                  <Link
                    href={branch.location}
                    target="_blank"
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    style={{ textDecoration: 'none' }}
                    _hover={{ color: 'blackAlpha.900' }}
                  >
                    <Box display="flex" alignItems="center">
                      <Icon as={MdLocationOn} boxSize={8} mr="1rem" color="primary.main" />
                      <Box>
                        <Text>{branch.address}</Text>
                        {/* <Text fontSize={14}>{branch.location}</Text> */}
                      </Box>
                    </Box>
                    <Icon as={MdOutlineNavigateNext} boxSize={8} color="primary.main" />
                  </Link>
                </GridItem>
                <GridItem display="flex" alignItems="center">
                  <Icon as={BiSolidTime} boxSize={7} mr="1rem" color="primary.main" />
                  <Text fontSize={17}>{branch.schedule}</Text>
                </GridItem>
                <GridItem
                  key={index}
                  display="flex"
                  alignItems="center"
                  pb={index === 1 ? 'none' : '1rem'}
                  borderBottom={index === 1 ? 'none' : '1px solid'}
                  borderColor="blackAlpha.300"
                >
                  <Icon as={FaPhoneAlt} boxSize={6} mr="1rem" color="primary.main" />
                  <Text>{branch.whatsApp.text}</Text>
                </GridItem>
              </>
            ))}
          </Grid>
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
            <Text fontSize="1.375rem" fontWeight="bold" mb="0.75rem">
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
              onSubmit={values => {
                setContactProps(values);
              }}
              validateOnChange={false}
              validateOnBlur={false}
            >
              {({ handleSubmit, errors }) => (
                <form onSubmit={handleSubmit}>
                  <VStack spacing={3} align="flex-start">
                    <FormControl isInvalid={!!errors.name}>
                      <FormLabel htmlFor="name">Nombre</FormLabel>
                      <Field
                        as={Input}
                        id="name"
                        name="name"
                        type="text"
                        variant="filled"
                        _focus={{ borderColor: 'primary.main' }}
                        disabled={isLoading}
                        validate={(value: any) => {
                          return validateEmpty(value);
                        }}
                      />
                      <FormErrorMessage>{errors.name}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.email}>
                      <FormLabel htmlFor="email">Correo electrónico</FormLabel>
                      <Field
                        as={Input}
                        id="email"
                        name="email"
                        type=""
                        variant="filled"
                        _focus={{ borderColor: 'primary.main' }}
                        disabled={isLoading}
                        validate={(value: any) => {
                          return validateEmail(value);
                        }}
                      />
                      <FormErrorMessage>{errors.email}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.phone}>
                      <FormLabel htmlFor="phone">Teléfono</FormLabel>
                      <Field
                        as={Input}
                        id="phone"
                        name="phone"
                        type="number"
                        variant="filled"
                        _focus={{ borderColor: 'primary.main' }}
                        disabled={isLoading}
                        validate={(value: any) => {
                          return validateEmpty(value);
                        }}
                      />
                      <FormErrorMessage>{errors.phone}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.subject}>
                      <FormLabel htmlFor="subject">Asunto</FormLabel>
                      <Field
                        as={Input}
                        id="subject"
                        name="subject"
                        type="text"
                        variant="filled"
                        _focus={{ borderColor: 'primary.main' }}
                        disabled={isLoading}
                        validate={(value: any) => {
                          return validateEmpty(value);
                        }}
                      />
                      <FormErrorMessage>{errors.subject}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.message}>
                      <FormLabel htmlFor="message">Mensaje</FormLabel>
                      <Field
                        as={Textarea}
                        resize="none"
                        id="message"
                        name="message"
                        type="text"
                        variant="filled"
                        _focus={{ borderColor: 'primary.main' }}
                        validate={(value: any) => {
                          return validateEmpty(value);
                        }}
                      />
                      <FormErrorMessage>{errors.message}</FormErrorMessage>
                    </FormControl>
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
                  </VStack>
                </form>
              )}
            </Formik>
          </Box>
        </Box>
      </Container>
    </>
  );
};
