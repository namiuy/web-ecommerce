import { Box, Container, Stack, Grid, GridItem } from 'ui';
import { ElementType } from 'react';
import SocialNetworks from './SocialNetworks';
import Newsletter from './Newsletter';
import { PaymentMethods } from './PaymentMethods';

const _backgroundColor = 'brand.footer.backgroundColor';

type FooterProps = {
  Logo: ElementType;
};

export const Footer = ({ Logo }: FooterProps) => {
  return (
    <Box bg={_backgroundColor} color="white" py="2rem">
      <Container
        as={Stack}
        maxW="6xl"
        px={{ base: '2rem', md: '2rem', xl: '0' }}
        pb={{ base: '2rem', md: '4rem', xl: '2rem' }}
      >
        <Grid
          templateAreas={{ base: `"a" "b" "c"`, sm: `"a c" "b b"`, md: `"a b c"` }}
          templateColumns={{ base: '1fr', sm: '1fr 1fr', md: '1fr 1.5fr 1fr' }}
          gap={12}
        >
          <GridItem gridArea="a" placeSelf="center start">
            <Logo />
          </GridItem>
          <GridItem gridArea="b" placeSelf="center stretch">
            <Newsletter />
          </GridItem>
          <GridItem gridArea="c" placeSelf={{ base: 'center', md: 'center end' }}>
            <SocialNetworks color="white" gap="1.5rem" size="1.75rem" />
          </GridItem>
        </Grid>
      </Container>
      <Container pt="1rem" pb="0.75rem">
        <PaymentMethods />
      </Container>
    </Box>
  );
};
