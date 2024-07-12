import { Head, Container, Box, GaPage } from 'ui';
import { NavBar, Footer, Paragraph, Title } from '../components';
import { NextPage } from 'next';

const _backgroundColor = 'brand.productDetail.backgroundColor';

const _containerSize = { lg: '75%', base: '90%' };
const _containerPadding = { lg: '2rem', base: '1rem' };
const _containerMarginTop = { lg: '3rem', base: '1.5rem' };
const _boxShadow = ' 0 3px 5px -1px rgb(0 0 0 / 5%), 0 6px 40px 0 rgb(0 0 0 / 3%), 0 1px 18px 0 rgb(0 0 0 / 2%) ';

const PoliciesPage: NextPage = () => {
  return (
    <GaPage page="Policies">
      <>
        <Box bg={_backgroundColor}>
          <Head />
          <NavBar />
          <Container maxW={_containerSize} p={_containerPadding} mt={_containerMarginTop} boxShadow={_boxShadow} bg="white">
            <Title>Política de privacidad</Title>
            <Paragraph pb="2.25rem">
              En Nami valoramos y protegemos la privacidad de nuestros usuarios. Cumplimos con las leyes de protección de datos aplicables y tratamos la
              información personal con cuidado. Explicamos qué tipo de información recopilamos, cómo la utilizamos y con quién la compartimos, garantizando
              transparencia en nuestras prácticas de manejo de datos. Los usuarios tienen derecho a acceder, modificar y eliminar su información personal según
              lo establecido en nuestra política de privacidad.
            </Paragraph>
            <Title>Términos y Condiciones</Title>
            <Paragraph pb="2.25rem">
              Establecemos las reglas y condiciones para el uso de la plataforma Nami. Esto incluye derechos y responsabilidades de los usuarios al interactuar
              con nuestros servicios. Detallamos el uso adecuado del contenido, derechos de propiedad intelectual, limitaciones de responsabilidad y
              procedimientos de resolución de disputas.
            </Paragraph>
            <Title>Política de Cookies</Title>
            <Paragraph pb="2.25rem">
              Informamos sobre el uso de cookies y tecnologías similares para mejorar la experiencia del usuario y personalizar el contenido. Explicamos cómo
              los usuarios pueden gestionar las preferencias de cookies y qué opciones tienen para controlar su uso.
            </Paragraph>
            <Title>Política de Seguridad</Title>
            <Paragraph pb="2.25rem">
              Nos comprometemos a proteger la información de nuestros usuarios mediante medidas de seguridad adecuadas. Detallamos nuestras prácticas para
              prevenir accesos no autorizados, pérdida de datos y cualquier otro riesgo relacionado con la seguridad de la información.
            </Paragraph>
            <Title>Política de Devoluciones y Reembolsos</Title>
            <Paragraph pb="2.25rem">
              Establecemos los términos y condiciones para devoluciones y reembolsos de productos o servicios adquiridos a través de Nami. Explicamos el
              proceso, plazos y condiciones bajo los cuales los usuarios pueden solicitar un reembolso o devolución.
            </Paragraph>
          </Container>
          <Box py="1.5rem"></Box>
        </Box>
        <Footer />
      </>
    </GaPage>
  );
};

export default PoliciesPage;
