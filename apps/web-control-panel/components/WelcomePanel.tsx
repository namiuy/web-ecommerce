import { Flex, Text } from 'ui';

export const WelcomePanel = () => {
  return (
    <Flex flexDir="column" justifyContent="center" alignItems="center" h="100%">
      <Text fontSize="2rem" fontWeight="medium">
        ¡Bienvenido!
      </Text>
      <Text fontSize="1.25rem">Seleccione una opción del menú lateral para comenzar</Text>
    </Flex>
  );
};
