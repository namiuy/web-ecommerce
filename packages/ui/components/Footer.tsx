import { Box, Container, Stack, Text, Grid, GridItem } from '@chakra-ui/react';
import { ReactNode, ElementType } from 'react';
import SocialNetworks from 'ui/components/SocialNetworks';
import { Newsletter } from './Newsletter';

// const ListHeader = ({ children }: { children: ReactNode }) => {
//   return (
//     <Text fontWeight={'500'} fontSize={'lg'} mb={2}>
//       {children}
//     </Text>
//   );
// };

type FooterProps = {
  logo: ElementType;
};

export const Footer = ({ logo: Logo }: FooterProps) => {
  return (
    <Box bg="primary.main" color="white">
      <Container
        as={Stack}
        maxW={'6xl'}
        pt="2rem"
        px={{ base: '2rem', md: '2rem', xl: '0' }}
        pb={{ base: '2rem', md: '4rem', xl: '2rem' }}
      >
        <Grid
          templateAreas={{ base: `"a" "b" "c"`, sm: `"a c" "b b"`, md: `"a b c"` }}
          templateColumns={{ base: '1fr', sm: '1fr 1fr', md: '1fr 1.5fr 1fr' }}
          gap={12}
        >
          <GridItem gridArea="a">
            <Stack spacing={1}>
              <Box>
                <Logo />
              </Box>
              <Text fontSize={'sm'}>© 2024 Nami Herramientas</Text>
            </Stack>
          </GridItem>

          <GridItem gridArea="b" placeSelf="center stretch">
            <Newsletter />
          </GridItem>

          <GridItem gridArea="c" placeSelf={{ base: 'center left', md: 'center right' }}>
            <SocialNetworks color="white" gap="2.25rem" size="1.25rem" />
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
};
