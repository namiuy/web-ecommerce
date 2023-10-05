import { Box, Container, Flex, Text } from '..';

export const Contact = () => {
  return (
    <>
      <Container mt="5rem" px="0" mb="3rem">
        <Text fontSize="1.375rem" fontWeight="bold">
          CONTACTO
        </Text>
      </Container>
      <Container py="1rem" mb="5rem" px="0">
        <Flex justifyContent="space-between">
          <Box
            bg="blackAlpha.200"
            h="15rem"
            w="79%"
            borderRadius="1rem"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Text>Mapa</Text>
          </Box>
          <Box w="20%">
            <Text pb="1rem">
              Bvar. Artigas 3397 <br /> Casi Gral. Flores
            </Text>
            <Text pb="1rem">Lunes a Viernes: de 8:00 a 12:00 y de 13:30 a 18:30hrs.</Text>
            <Text pb="1rem">2402 1350 - 22034381</Text>
            <Text>098 000 600</Text>
          </Box>
        </Flex>
      </Container>
      <Container py="1rem" px="0">
        <Flex justifyContent="space-between">
          <Box w="20%" textAlign="right">
            <Text pb="1rem">
              Cerro Largo 1518 <br />
              Esq. Piedra Alta
            </Text>
            <Text pb="1rem">Lunes a Viernes: de 8:00 a 12:30 y de 13:30 a 18:00hrs.</Text>
            <Text pb="1rem">2402 0922 - 2402 0031</Text>
            <Text>091 033 282</Text>
          </Box>
          <Box
            bg="blackAlpha.200"
            h="15rem"
            w="79%"
            borderRadius="1rem"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Text>Mapa</Text>
          </Box>
        </Flex>
      </Container>
    </>
  );
};
