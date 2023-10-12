import { Link, Icon, Textarea, useBreakpointValue } from '@chakra-ui/react';
import { Box, Container, Flex, Text, Map, Grid, GridItem, Button } from 'ui';
import { AiOutlineClockCircle } from 'react-icons/ai';
import { useFormik } from 'formik';
import { FormControl, FormLabel, Input, VStack } from '@chakra-ui/react';
import { MdLocationOn } from 'react-icons/md';
import { FaPhoneAlt } from 'react-icons/fa';
import { BiSolidTime } from 'react-icons/bi';

const data = [
  {
    direccion: 'Bvar. Artigas 3397',
    detalle: 'Casi Gral. Flores',
    horario: 'Lunes a Viernes: de 8:00 a 12:00hs y de 13:30 a 18:30hs',
    telefono: '2402 1350 - 2203 4381',
    ubicacion: { lat: -34.8704995, lng: -56.17636 },
  },
  {
    direccion: 'Cerro Largo 1518',
    detalle: 'Esq. Piedra Alta',
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
        {md ? (
          <Flex position="relative">
            <Box w="100%">
              <Map
                position={[data[0].ubicacion, data[1].ubicacion]}
                zoom={13}
                h="91vh"
                center={{ lat: -34.89054118139598, lng: -56.17411952377538 }}
              />
            </Box>
            <Grid
              w="21rem"
              gridTemplateColumns={`1fr`}
              gap={4}
              fontWeight="medium"
              fontSize="1.25rem"
              bg="white"
              color="blackAlpha.600"
              p={6}
              borderRadius={16}
              position="absolute"
              left="12"
              top="50%"
              transform="translateY(-50%)"
              boxShadow="2xl"
            >
              {data.map((item, index) => (
                <>
                  <GridItem display="flex" alignItems="center">
                    <Icon as={MdLocationOn} boxSize={8} mr="1rem" color="primary.main" />
                    <Box>
                      <Text>{item.direccion}</Text>
                      <Text fontSize={14}>{item.detalle}</Text>
                    </Box>
                  </GridItem>
                  <GridItem display="flex" alignItems="center">
                    <Icon as={BiSolidTime} boxSize={7} mr="1rem" color="primary.main" />
                    <Text fontSize={18}>{item.horario}</Text>
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
              w="25rem"
              bg="white"
              color="blackAlpha.700"
              p={6}
              borderRadius={16}
              position="absolute"
              right="12"
              top="50%"
              transform="translateY(-50%)"
              boxShadow="2xl"
            >
              <form onSubmit={formik.handleSubmit}>
                <VStack spacing={4} align="flex-start">
                  <FormControl>
                    <FormLabel htmlFor="nombre">Nombre</FormLabel>
                    <Input
                      id="nombre"
                      name="nombre"
                      type="text"
                      variant="filled"
                      bg="blackAlpha.100"
                      onChange={formik.handleChange}
                      value={formik.values.nombre}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor="email">Correo electrónico</FormLabel>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      variant="filled"
                      bg="blackAlpha.100"
                      onChange={formik.handleChange}
                      value={formik.values.email}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor="telefono">Teléfono</FormLabel>
                    <Input
                      id="telefono"
                      name="telefono"
                      type="number"
                      variant="filled"
                      bg="blackAlpha.100"
                      onChange={formik.handleChange}
                      value={formik.values.telefono}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor="asunto">Asunto</FormLabel>
                    <Input
                      id="asunto"
                      name="asunto"
                      type="text"
                      variant="filled"
                      bg="blackAlpha.100"
                      onChange={formik.handleChange}
                      value={formik.values.asunto}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor="mensaje">Mensaje</FormLabel>
                    <Textarea
                      id="mensaje"
                      name="mensaje"
                      variant="filled"
                      resize="none"
                      bg="blackAlpha.100"
                      height={24}
                      onChange={formik.handleChange}
                      value={formik.values.mensaje}
                    />
                  </FormControl>
                  <Button type="submit" bg="primary.main" color="white" width="full" mt={2}>
                    ENVIAR
                  </Button>
                </VStack>
              </form>
            </Box>
          </Flex>
        ) : (
          <Box bg="blackAlpha.100">
            <Box w="100%">
              <Map
                position={[data[0].ubicacion, data[1].ubicacion]}
                zoom={12}
                h="50vh"
                center={{ lat: -34.89054118139598, lng: -56.17411952377538 }}
              />
            </Box>
            <Grid
              gridTemplateColumns={`1fr`}
              gap={4}
              fontWeight="medium"
              fontSize="1.25rem"
              bg="white"
              color="blackAlpha.600"
              p={6}
              borderRadius={16}
              boxShadow="2xl"
            >
              {data.map((item, index) => (
                <>
                  <GridItem display="flex" alignItems="center">
                    <Icon as={MdLocationOn} boxSize={8} mr="1rem" color="primary.main" />
                    <Box>
                      <Text>{item.direccion}</Text>
                      <Text fontSize={14}>{item.detalle}</Text>
                    </Box>
                  </GridItem>
                  <GridItem display="flex" alignItems="center">
                    <Icon as={BiSolidTime} boxSize={7} mr="1rem" color="primary.main" />
                    <Text fontSize={18}>{item.horario}</Text>
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
            <Box color="blackAlpha.700" bg="white" p={6} boxShadow="2xl" my={8} borderRadius={16}>
              <form onSubmit={formik.handleSubmit}>
                <VStack spacing={4} align="flex-start">
                  <FormControl>
                    <FormLabel htmlFor="nombre">Nombre</FormLabel>
                    <Input
                      id="nombre"
                      name="nombre"
                      type="text"
                      variant="filled"
                      bg="blackAlpha.100"
                      onChange={formik.handleChange}
                      value={formik.values.nombre}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor="email">Correo electrónico</FormLabel>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      variant="filled"
                      bg="blackAlpha.100"
                      onChange={formik.handleChange}
                      value={formik.values.email}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor="telefono">Teléfono</FormLabel>
                    <Input
                      id="telefono"
                      name="telefono"
                      type="number"
                      variant="filled"
                      bg="blackAlpha.100"
                      onChange={formik.handleChange}
                      value={formik.values.telefono}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor="asunto">Asunto</FormLabel>
                    <Input
                      id="asunto"
                      name="asunto"
                      type="text"
                      variant="filled"
                      bg="blackAlpha.100"
                      onChange={formik.handleChange}
                      value={formik.values.asunto}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor="mensaje">Mensaje</FormLabel>
                    <Textarea
                      id="mensaje"
                      name="mensaje"
                      variant="filled"
                      resize="none"
                      bg="blackAlpha.100"
                      height={24}
                      onChange={formik.handleChange}
                      value={formik.values.mensaje}
                    />
                  </FormControl>
                  <Button type="submit" bg="primary.main" color="white" width="full" mt={2}>
                    ENVIAR
                  </Button>
                </VStack>
              </form>
            </Box>
          </Box>
        )}
      </Container>
    </>
  );
};
