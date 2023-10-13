import { Link, Icon, Textarea, useBreakpointValue } from '@chakra-ui/react';
import { Box, Container, Text, Map, Grid, GridItem, Button } from 'ui';
import { useFormik } from 'formik';
import { FormControl, FormLabel, Input, VStack } from '@chakra-ui/react';
import { MdLocationOn } from 'react-icons/md';
import { FaPhoneAlt } from 'react-icons/fa';
import { BiSolidTime } from 'react-icons/bi';
import { MdOutlineNavigateNext } from 'react-icons/md';

const data = [
  {
    direccion: 'Bvar. Artigas 3397',
    detalle: 'Casi Gral. Flores',
    direccionLink: 'https://goo.gl/maps/8EZqjv8GDNFBBoAM9',
    horario: 'Lunes a Viernes: de 8:00 a 12:00hs y de 13:30 a 18:30hs',
    telefono: '2402 1350 - 2203 4381',
    ubicacion: { lat: -34.8704995, lng: -56.17636 },
  },
  {
    direccion: 'Cerro Largo 1518',
    detalle: 'Esq. Piedra Alta',
    direccionLink: 'https://goo.gl/maps/9Uhq6dWkB9FrVQmp6',
    horario: 'Lunes a Viernes: de 8:00 a 12:30hs y de 13:30 a 18:00hs',
    telefono: '2402 0922 - 2402 0031',
    ubicacion: { lat: -34.9001314, lng: -56.1847301 },
  },
];

export const Contact = () => {
  const formik = useFormik({
    initialValues: {
      nombre: '',
      email: '',
      telefono: '',
      asunto: '',
      mensaje: '',
    },
    onSubmit: values => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  const md = useBreakpointValue({ base: false, lg: true });

  return (
    <>
      <Container px="0" minW="100%">
        <Box position={md ? 'relative' : 'static'}>
          <Box w="100%">
            <Map
              position={[data[0].ubicacion, data[1].ubicacion]}
              zoom={md ? 13 : 12}
              h={md ? '91vh' : '50vh'}
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
            w={md ? '20rem' : '100%'}
            position={md ? 'absolute' : 'static'}
            left={md ? '12' : '0'}
            top={md ? '50%' : '0'}
            transform={md ? 'translateY(-50%)' : 'none'}
            mb={md ? 'none' : '8'}
          >
            {data.map((item, index) => (
              <>
                <GridItem>
                  <Link
                    href={item.direccionLink}
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
                        <Text>{item.direccion}</Text>
                        <Text fontSize={14}>{item.detalle}</Text>
                      </Box>
                    </Box>
                    <Icon as={MdOutlineNavigateNext} boxSize={8} color="primary.main" />
                  </Link>
                </GridItem>
                <GridItem display="flex" alignItems="center">
                  <Icon as={BiSolidTime} boxSize={7} mr="1rem" color="primary.main" />
                  <Text fontSize={17}>{item.horario}</Text>
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
                  <Text>{item.telefono}</Text>
                </GridItem>
              </>
            ))}
          </Grid>
          <Box
            bg="white"
            color="blackAlpha.700"
            p={6}
            borderRadius={16}
            boxShadow="2xl"
            w={md ? '25rem' : '100%'}
            position={md ? 'absolute' : 'static'}
            right={md ? '12' : '0'}
            top={md ? '50%' : '0'}
            transform={md ? 'translateY(-50%)' : 'none'}
            mb={md ? 'none' : '8'}
          >
            <Text fontSize="1.375rem" fontWeight="bold" mb="0.75rem">
              Contáctese con nosotros
            </Text>
            <form onSubmit={formik.handleSubmit}>
              <VStack spacing={4} align="flex-start">
                <FormControl>
                  <FormLabel>Nombre</FormLabel>
                  <Input
                    id="nombre"
                    name="nombre"
                    type="text"
                    variant="filled"
                    bg="blackAlpha.100"
                    onChange={formik.handleChange}
                    value={formik.values.nombre}
                    _hover={{ backgroundColor: 'blackAlpha.300' }}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Correo electrónico</FormLabel>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    variant="filled"
                    bg="blackAlpha.100"
                    onChange={formik.handleChange}
                    value={formik.values.email}
                    _hover={{ backgroundColor: 'blackAlpha.300' }}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Teléfono</FormLabel>
                  <Input
                    id="telefono"
                    name="telefono"
                    type="number"
                    variant="filled"
                    bg="blackAlpha.100"
                    onChange={formik.handleChange}
                    value={formik.values.telefono}
                    _hover={{ backgroundColor: 'blackAlpha.300' }}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Asunto</FormLabel>
                  <Input
                    id="asunto"
                    name="asunto"
                    type="text"
                    variant="filled"
                    bg="blackAlpha.100"
                    onChange={formik.handleChange}
                    value={formik.values.asunto}
                    _hover={{ backgroundColor: 'blackAlpha.300' }}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Mensaje</FormLabel>
                  <Textarea
                    id="mensaje"
                    name="mensaje"
                    variant="filled"
                    resize="none"
                    bg="blackAlpha.100"
                    height={24}
                    onChange={formik.handleChange}
                    value={formik.values.mensaje}
                    _hover={{ backgroundColor: 'blackAlpha.300' }}
                  />
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
          </Box>
        </Box>
      </Container>
    </>
  );
};
