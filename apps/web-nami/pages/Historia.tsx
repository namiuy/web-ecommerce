import { Head, Container, Heading, Text, Box } from 'ui';
import { NavBar } from '../components';

const _backgroundColor = 'brand.productDetail.backgroundColor';

const _containerSize = { lg: '65%', base: '90%' };
const _containerPadding = { lg: '2rem', base: '1rem' };

const _boxShadow = ' 0 3px 5px -1px rgb(0 0 0 / 5%), 0 6px 40px 0 rgb(0 0 0 / 3%), 0 1px 18px 0 rgb(0 0 0 / 2%) ';

const Historia = () => {
  return (
    <Box minHeight={'100vh'} bg={_backgroundColor}>
      <Head />
      <NavBar />
      <Box py={'1rem'}></Box>
      <Container maxW={_containerSize} p={_containerPadding} boxShadow={_boxShadow} mt={'8rem'} bg={'white'}>
        <Heading mb={'1rem'} borderBottom={'1px'}>
          Historia
        </Heading>
        <Text pb={'1rem'} style={{ textAlign: 'justify' }}>
          Luis Panasco S.A. es una Empresa familiar, fundada hace más de 50 años por don Luis D´Assuncao Panasco como fabricante de radiadores de automóvil para
          el mercado de reposición.
        </Text>
        <Text pb={'1rem'} style={{ textAlign: 'justify' }}>
          En el año 1975 la Empresa desarrolla y produce su primer radiador como unidad original para la primer planta de Armado Automotriz Uruguaya, para un
          vehículo con motor General Motors. Posteriormente ha sido proveedora de distintas Marcas de vehículos cero kilómetro tales como: Fiat. Ford, General
          Motors, Renault, Citroen, Peugeot; exportando a Argentina durante los años 1977 1981 unidades para automóviles cero kilometro de las marcas Fiat y
          Renault. Durante 27 años nuestra Empresa ha acompañado a la Industria Automotriz ajustando nuestros procesos a sus muy exigentes normas de calidad
        </Text>
        <Text pb={'1rem'} style={{ textAlign: 'justify' }}>
          NAMI inició su actividad como distribuidores de Luis Panasco S.A., de sus productos “Radiadores EL IMAN”, por la necesidad de estar en contacto
          directo con nuestros clientes. Fue así que en 1986 abrimos nuestro primer local en la calle Br. Artigas, ofreciendo el servicio para el sistema de
          enfriamiento y reparación de radiadores.
        </Text>
        <Text pb={'1rem'} style={{ textAlign: 'justify' }}>
          Inmediatamente, atentos a las necesidades de nuestro mercado y a nuestra obligación para con nuestros clientes de ofrecerles un servicio cada vez más
          integral, anexamos otros servicios y productos en nuestros locales. Comenzando con productos importados como radiadores, intercoolers, condensadores,
          electroventiladores, etc. Siendo desde esa época representantes y distribuidres de las firmas Behr, Valeo, Visconde, Delphi, entre otras.
        </Text>
        <Text pb={'1rem'} style={{ textAlign: 'justify' }}>
          Años más tarde, abrimos nuestro segundo local en la calle Cerro Largo, orientado a la instalacion de equipos de aire acondicionado, con colocación en
          vehículos 0Km, así como tambien reparación y venta de todo tipo de repuestos para unidades usadas.
        </Text>
        <Text pb={'1rem'} style={{ textAlign: 'justify' }}>
          Como consecuencia de nuestra visitas, y viajes a ferias internacionales, vimos la necesidad de incluír en nuestros productos, la línea de bombas de
          aguas, viscosos, radiadores de aceite, y todo lo referente a los sistemas de enfriamiento y A/A automotrices y líneas pesadas. En una segunda etapa se
          incorporaron insumos de inyección electrónica y herramientas de diagnóstico.
        </Text>
        <Text pb={'1rem'} style={{ textAlign: 'justify' }}>
          Debido al gran crecimiento de estas últimas incorporaciones, nos vimos agregar un servicio de postventa especializado para la atencion de herramientas
          y equipamiento para el taller mecánico, como elevadores, scanners, balanceadoras, alienadoras, entre otras.
        </Text>
        <Text pb={'1rem'} style={{ textAlign: 'justify' }}>
          Luego de tantos años en el mercado, comprendemos que a nuestros clientes es importante brindarle un servicio integral, por tal motivo, si bien cada
          local se especifica en su tarea principal, ninguna abandonó la venta de los repuestos con la que comenzamos y crecimos.
        </Text>
        <Text pb={'1rem'} style={{ textAlign: 'justify' }}>
          Sin olvidar nuestros principios y orgullosos de nuestro crecimiento, mantenemos hasta el día de hoy los valores de nuestros orígenes como empresa
          familiar.
        </Text>
      </Container>
      <Box py={'2rem'}></Box>
    </Box>
  );
};

export default Historia;
