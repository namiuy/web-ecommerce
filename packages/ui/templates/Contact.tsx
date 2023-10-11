import { Link, Icon } from '@chakra-ui/react';
import { Box, Container, Flex, Text, Map, Grid, GridItem } from 'ui';
import { AiOutlineClockCircle, AiOutlineWhatsApp } from 'react-icons/ai';
import { IoCallOutline, IoLocationOutline } from 'react-icons/io5';

const data = [
  {
    direccion: 'Bvar. Artigas 3397 Casi Gral. Flores',
    horario: 'Lunes a Viernes: de 8:00 a 12:00hs y de 13:30 a 18:30hs',
    telefono: '2402 1350 - 2203 4381',
    ubicacion: { lat: -34.8704995, lng: -56.17636 },
  },
  {
    direccion: 'Cerro Largo 1518 Esq. Piedra Alta',
    horario: 'Lunes a Viernes: de 8:00 a 12:30hs y de 13:30 a 18:00hs',
    telefono: '2402 0922 - 2402 0031',
    ubicacion: { lat: -34.9001314, lng: -56.1847301 },
  },
];

export const Contact = () => {
  return (
    <>
      <Container px="0" minW="100%">
        <Flex position="relative">
          <Box w="100%">
            <Map
              position={[data[0].ubicacion, data[1].ubicacion]}
              h="91vh"
              center={{ lat: -34.89054118139598, lng: -56.17411952377538 }}
            />
          </Box>
          {data.map((item, index) => (
            <Grid
              key={index}
              w="15rem"
              gridTemplateAreas={`"a" "b" "c"`}
              gridTemplateColumns={`1fr`}
              gridTemplateRows={`1fr 1fr 1fr`}
              placeItems="center"
              gap={4}
              fontWeight="medium"
              fontSize="1.125rem"
              color="white"
              py={2}
              borderRadius={16}
              position="absolute"
              left={index === 0 ? 16 : 'auto'}
              right={index === 1 ? 16 : 'auto'}
              top="50%"
              transform="translateY(-50%)"
              boxShadow="2xl"
              backdropFilter="auto"
              backdropContrast="30%"
            >
              <GridItem gridArea="a" textAlign="center">
                <Icon as={IoLocationOutline} w={'2.5rem'} h={'2.5rem'} />
                <Text fontSize="1.125rem" fontWeight="bold" mb="0.25rem">
                  DIRECCION
                </Text>
                <Text w="70%" margin="0 auto">
                  {item.direccion}
                </Text>
              </GridItem>
              <GridItem gridArea="b" textAlign="center">
                <Icon as={AiOutlineClockCircle} w={'2.5rem'} h={'2.5rem'} />
                <Text fontSize="1.125rem" fontWeight="bold" mb="0.25rem">
                  HORARIO
                </Text>
                <Text w="80%" margin="0 auto">
                  {item.horario}
                </Text>
              </GridItem>
              <GridItem gridArea="c" textAlign="center">
                <Icon as={IoCallOutline} w={'2.5rem'} h={'2.5rem'} />
                <Text fontSize="1.125rem" fontWeight="bold" mb="0.25rem">
                  TELEFONO
                </Text>
                <Text>{item.telefono}</Text>
              </GridItem>
            </Grid>
          ))}
        </Flex>
      </Container>
    </>
  );
};
