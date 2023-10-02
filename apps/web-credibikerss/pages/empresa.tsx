import { Head, Container, Heading, Box, Card, Center, Stack, StackDivider, Text, GaPage } from 'ui';
import { NavBar } from '../components';
import { Footer } from '../components/Footer';
import { CardBody } from '@chakra-ui/react';

const _grey0 = 'brand.grey.0';

const Company = () => (
  <GaPage page="Company">
    <Box bg={_grey0}>
      <Head />
      <NavBar />
      <Box h={{ base: '2rem', lg: '4rem' }} />
      <Center>
        <Container maxW="2xl">
          <Card size="md">
            <CardBody p="2rem 1.5rem 4rem 1.5rem">
              <Stack divider={<StackDivider />} gap="2rem">
                <div>
                  <Heading as="h4" size="md">
                    Historia
                  </Heading>
                  <Box h="1rem" />
                  <Text>
                    Credibikerss es una empresa familiar que nace en Montevideo, Uruguay, desde hace más de diez años
                    con el anhelo de extender la marca en todo el Uruguay. Con el paso del tiempo nos extendimos,
                    actualmente Credibikerss cuenta con dos sucursales, una en Cordón, Montevideo y otra en Las Piedras,
                    Canelones. Nos dedicamos a la venta de motocicletas y accesorios.
                  </Text>
                </div>

                <div>
                  <Heading as="h4" size="md">
                    Misión
                  </Heading>
                  <Box h="1rem" />
                  <Text>
                    Nos enfocamos en brindar una solución inmediata a usuarios que necesitan adquirir un vehículo y no
                    cuentan con los recursos necesarios. Apostamos a una excelente atención en la venta y la post-venta.
                  </Text>
                </div>

                <div>
                  <Heading as="h4" size="md">
                    Visión
                  </Heading>
                  <Box h="1rem" />
                  <Text>
                    Ser los mejores en lo que hacemos, satisfacer la necesidad del cliente, alcanzar cada rincón del
                    Uruguay y extender la solución a cada ciudadano que necesite de nuestra ayuda. Lo principal es hacer
                    realidad el sueño de tu primer vehículo garantido.
                  </Text>
                </div>
              </Stack>
            </CardBody>
          </Card>
        </Container>
      </Center>
      <Box h="6rem" />
      <Footer />
    </Box>
  </GaPage>
);
export default Company;
