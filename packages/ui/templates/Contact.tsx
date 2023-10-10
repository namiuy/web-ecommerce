import { Link, Icon } from '@chakra-ui/react';
import { Box, Container, Flex, Text, Map, Grid, GridItem } from 'ui';
import { AiOutlineClockCircle, AiOutlineWhatsApp } from 'react-icons/ai';
import { IoCallOutline, IoLocationOutline } from 'react-icons/io5';

const data = {
  direccion: 'Bvar. Artigas 3397 Casi Gral. Flores',
  horario: 'Lunes a Viernes: de 8:00 a 12:00hs y de 13:30 a 18:30hs',
  telefono: '2402 1350 - 2203 4381',
};

export const Contact = () => {
  return (
    <>
      <Container px="0" minW="100%">
        <Flex position="relative">
          <Box w="100%">
            <Map position={{ lat: -34.9001314, lng: -56.1847301 }} h="91vh" zoom={16} />
          </Box>
          <Grid
            w="20%"
            gridTemplateAreas={`"a" "b" "c"`}
            gridTemplateColumns={`1fr`}
            gridTemplateRows={`1fr 1fr 1fr`}
            placeItems="center"
            gap={4}
            fontWeight="medium"
            fontSize="1.125rem"
            bg="primary.main"
            color="white"
            py={4}
            borderRadius={8}
            position="absolute"
            top="50%"
            left={16}
            transform="translateY(-50%)"
          >
            <GridItem gridArea="a" textAlign="center">
              <Icon as={IoLocationOutline} w={'2.5rem'} h={'2.5rem'} />
              <Text fontSize="1.25rem" fontWeight="bold" mb="0.25rem">
                DIRECCION
              </Text>
              <Text w="75%" margin="0 auto">
                {data.direccion}
              </Text>
            </GridItem>
            <GridItem gridArea="b" textAlign="center">
              <Icon as={AiOutlineClockCircle} w={'2.5rem'} h={'2.5rem'} />
              <Text fontSize="1.25rem" fontWeight="bold" mb="0.25rem">
                HORARIO
              </Text>
              <Text w="80%" margin="0 auto">
                {data.horario}
              </Text>
            </GridItem>

            <GridItem gridArea="c" textAlign="center">
              <Icon as={IoCallOutline} w={'2.5rem'} h={'2.5rem'} />
              <Text fontSize="1.25rem" fontWeight="bold" mb="0.25rem">
                TELEFONO
              </Text>
              <Text>{data.telefono}</Text>
            </GridItem>
          </Grid>
        </Flex>
      </Container>
    </>
  );
};
