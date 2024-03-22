import { Head, Container, Heading, Text, Box, GaPage } from 'ui';
import { NavBar } from '../components';
import { NextPage } from 'next';
import { ReactNode } from 'react';

const _backgroundColor = 'brand.productDetail.backgroundColor';
const _borderColor = 'brand.productDetail.borderColor';

const _containerSize = { lg: '75%', base: '90%' };
const _containerPadding = { lg: '2rem', base: '1rem' };
const _containerMarginTop = { lg: '3rem', base: '1.5rem' };

const _boxShadow = ' 0 3px 5px -1px rgb(0 0 0 / 5%), 0 6px 40px 0 rgb(0 0 0 / 3%), 0 1px 18px 0 rgb(0 0 0 / 2%) ';

const Paragraph = ({ children }: { children: ReactNode }) => (
  <Text pb={'1.25rem'} style={{ textAlign: 'justify' }}>
    {children}
  </Text>
);

const CompanyPage: NextPage = () => {
  return (
    <GaPage page="Company">
      <Box bg={_backgroundColor}>
        <Head />
        <NavBar />
        <Container maxW={_containerSize} p={_containerPadding} mt={_containerMarginTop} boxShadow={_boxShadow} bg="white">
          <Heading pb="0.5rem" mb="1rem" borderBottom="1px" borderColor={_borderColor}>
            Nuestra historia
          </Heading>
          <Paragraph>
            Luis Panasco S.A. es una empresa familiar con más de 50 años de trayectoria, fundada por don Luis D´Assuncao Panasco como fabricante de radiadores
            de automóvil para el mercado de reposición.
          </Paragraph>
          <Paragraph>
            En 1975, la empresa dio un importante paso al desarrollar y producir su primer radiador como unidad original para la planta de Armado Automotriz
            Uruguaya, destinado a un vehículo con motor General Motors. Desde entonces, hemos sido proveedores de distintas marcas de vehículos cero kilómetro,
            como Fiat, Ford, General Motors, Renault, Citroen y Peugeot. Durante los años 1977 y 1981, también exportamos unidades para automóviles cero
            kilómetro de las marcas Fiat y Renault a Argentina. A lo largo de 27 años, hemos acompañado a la industria automotriz, adaptando nuestros procesos
            para cumplir con sus exigentes normas de calidad.
          </Paragraph>
          <Paragraph>
            En ese contexto, NAMI se inició como distribuidores de los productos &quot;Radiadores EL IMÁN&quot; de Luis Panasco S.A., con el objetivo de estar
            más cerca de nuestros clientes. En 1986, abrimos nuestro primer local en la calle Br. Artigas, ofreciendo servicios de reparación y mantenimiento de
            sistemas de enfriamiento y radiadores.
          </Paragraph>
          <Paragraph>
            Atentos a las necesidades del mercado y a la satisfacción de nuestros clientes, ampliamos nuestra oferta y añadimos otros servicios y productos en
            nuestros locales. Incorporamos productos importados como radiadores, intercoolers, condensadores, electroventiladores, entre otros, convirtiéndonos
            en representantes y distribuidores de marcas como Behr, Valeo, Visconde, Delphi, entre otras.
          </Paragraph>
          <Paragraph>
            Posteriormente, inauguramos un segundo local en la calle Cerro Largo, especializado en la instalación de equipos de aire acondicionado para
            vehículos 0Km, así como en la venta y reparación de repuestos para unidades usadas.
          </Paragraph>
          <Paragraph>
            A través de nuestras visitas a ferias internacionales, identificamos la necesidad de ampliar nuestra gama de productos para incluir bombas de aguas,
            viscosos, radiadores de aceite y todo lo relacionado con sistemas de enfriamiento y aire acondicionado para vehículos tanto ligeros como pesados. En
            una segunda etapa, también incorporamos insumos de inyección electrónica y herramientas de diagnóstico.
          </Paragraph>
          <Paragraph>
            Dado el crecimiento de estas nuevas incorporaciones, implementamos un servicio de postventa especializado para atender herramientas y equipamiento
            destinados a talleres mecánicos, como elevadores, scanners, balanceadoras y alienadoras, entre otros.
          </Paragraph>
          <Text style={{ textAlign: 'justify' }}>
            A pesar de nuestro crecimiento y evolución, nunca hemos olvidado nuestros principios. Nos enorgullecemos de mantener los valores que nos identifican
            como empresa familiar desde nuestros inicios. Si bien cada local se enfoca en su tarea principal, nunca hemos abandonado la venta de repuestos, con
            la cual comenzamos y crecimos, pues comprendemos la importancia de brindar un servicio integral a nuestros apreciados clientes, quienes son la razón
            de nuestro éxito hasta el día de hoy.
          </Text>
        </Container>
        <Box py="1.5rem"></Box>
      </Box>
    </GaPage>
  );
};

export default CompanyPage;
