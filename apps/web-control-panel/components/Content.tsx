import { Flex } from 'ui';
import { ReactNode } from 'react';

export const Content = ({ children }: { children: ReactNode }) => (
  <Flex flexDir="column" w="100%" minW="75rem">
    <Flex justifyContent="center" alignItems="center" h="100vh" bg="#f7f7f7">
      <Flex
        flexDir="column"
        px="2rem"
        py="1.25rem"
        w="97%"
        h="95%"
        m="1rem"
        bg="white"
        borderRadius="0.5rem"
        border="2px solid"
        borderColor="#f2f2f2"
        gap="1.25rem"
      >
        {children}
      </Flex>
    </Flex>
  </Flex>
);
