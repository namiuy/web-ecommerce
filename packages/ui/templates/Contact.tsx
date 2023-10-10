import { Link, Divider, Icon } from '@chakra-ui/react';
import { Box, Container, Flex, Text, Map, Grid, GridItem } from 'ui';
import { AiOutlineClockCircle, AiOutlineWhatsApp } from 'react-icons/ai';
import { IoCallOutline, IoLocationOutline } from 'react-icons/io5';

export const Contact = () => {
  return (
    <>
      <Container mt="3.5rem" px="0" mb="1rem">
        <Text fontSize="1.5rem" fontWeight="bold">
          CONTACTO
        </Text>
      </Container>
      <Divider />
      <Container my="2rem" px="0">
        <Flex>
          <Box w="50%">
            <Map position={{ lat: -34.9001314, lng: -56.1847301 }} h="25rem" zoom={16} />
          </Box>
          <Grid
            w="50%"
            fontWeight="500"
            fontSize="1.125rem"
            bg="primary.main"
            color="white"
            p="1.5rem"
            borderRadius="0 1rem 1rem 0"
            gridTemplateAreas={`"a b" "c d"`}
            gridTemplateColumns={`1fr 1fr`}
            gridTemplateRows={`1fr 1fr`}
            placeItems="center"
          >
            <GridItem gridArea="a" textAlign="center">
              <Icon as={IoLocationOutline} w={'2.5rem'} h={'2.5rem'} />
              <Text fontSize="1.25rem" fontWeight="bold" mb="0.25rem">
                DIRECCION
              </Text>
              <Text>
                Bvar. Artigas 3397 <br /> Casi Gral. Flores
              </Text>
            </GridItem>
            <GridItem gridArea="b" textAlign="center">
              <Icon as={AiOutlineClockCircle} w={'2.5rem'} h={'2.5rem'} />
              <Text fontSize="1.25rem" fontWeight="bold" mb="0.25rem">
                HORARIO
              </Text>
              <Text>Lunes a Viernes: de 8:00 a 12:00 y de 13:30 a 18:30hrs.</Text>
            </GridItem>

            <GridItem gridArea="c" textAlign="center">
              <Icon as={IoCallOutline} w={'2.5rem'} h={'2.5rem'} />
              <Text fontSize="1.25rem" fontWeight="bold" mb="0.25rem">
                TELEFONO
              </Text>
              <Text>2402 1350 - 2203 4381</Text>
            </GridItem>

            <GridItem gridArea="d" textAlign="center">
              <Icon as={AiOutlineWhatsApp} w={'2.5rem'} h={'2.5rem'} />
              <Text fontSize="1.25rem" fontWeight="bold" mb="0.25rem">
                WhatsApp
              </Text>
              <Text>098 000 600</Text>
            </GridItem>
          </Grid>
        </Flex>
      </Container>
      <Divider />
      <Container my="2rem" px="0">
        <Flex>
          <Grid
            w="50%"
            fontWeight="500"
            fontSize="1.125rem"
            bg="primary.main"
            color="white"
            p="1.5rem"
            borderRadius="1rem 0 0 1rem"
            gridTemplateAreas={`"a b" "c d"`}
            gridTemplateColumns={`1fr 1fr`}
            gridTemplateRows={`1fr 1fr`}
            placeItems="center"
          >
            <GridItem gridArea="a" textAlign="center">
              <Icon as={IoLocationOutline} w={'2.5rem'} h={'2.5rem'} />
              <Text fontSize="1.25rem" fontWeight="bold" mb="0.25rem">
                DIRECCION
              </Text>
              <Text>
                Cerro Largo 1518 <br />
                Esq. Piedra Alta
              </Text>
            </GridItem>
            <GridItem gridArea="b" textAlign="center">
              <Icon as={AiOutlineClockCircle} w={'2.5rem'} h={'2.5rem'} />
              <Text fontSize="1.25rem" fontWeight="bold" mb="0.25rem">
                HORARIO
              </Text>
              <Text>Lunes a Viernes: de 8:00 a 12:30 y de 13:30 a 18:00hrs.</Text>
            </GridItem>

            <GridItem gridArea="c" textAlign="center">
              <Icon as={IoCallOutline} w={'2.5rem'} h={'2.5rem'} />
              <Text fontSize="1.25rem" fontWeight="bold" mb="0.25rem">
                TELEFONO
              </Text>
              <Text>2402 0922 - 2402 0031</Text>
            </GridItem>

            <GridItem gridArea="d" textAlign="center">
              <Icon as={AiOutlineWhatsApp} w={'2.5rem'} h={'2.5rem'} />
              <Text fontSize="1.25rem" fontWeight="bold" mb="0.25rem">
                WhatsApp
              </Text>
              <Text>091 033 282</Text>
            </GridItem>
          </Grid>
          <Box w="50%">
            <Map position={{ lat: -34.9001314, lng: -56.1847301 }} h="25rem" zoom={16} />
          </Box>
        </Flex>
      </Container>
    </>
  );
};
