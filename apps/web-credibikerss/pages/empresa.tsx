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
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                    industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type
                    and scrambled it to make a type specimen book. It has survived not only five centuries, but also the
                    leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s
                    with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop
                    publishing software like Aldus PageMaker including versions of Lorem Ipsum.
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
