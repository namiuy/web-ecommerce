import NextLink from 'next/link';
import { FC } from 'react';
import { AnimationWrapper, Box, Center, Container, Flex, Grid, Heading, Map } from 'ui';
import SocialNeworks from 'ui/components/SocialNeworks';
import { IoLogoWhatsapp } from 'react-icons/io5';
import { Icon, Link } from '@chakra-ui/react';
import { useBreakpointValue } from '@chakra-ui/react';

const _primaryColor = 'brand.primary';

const _color = '#d5d5d5';
const _mapH = '26rem';
const _bg = '#060606';
const _addressColor = 'brand.grey.2';
const _branchNameSize = { base: '1.2rem', sm: '1.4rem', lg: '1.8rem' };
const _wspSize = { base: '1rem', sm: '1.2rem', lg: '1.6rem' };
const _wspIconSize = { base: '1rem', sm: '1rem' };

const branches = [
  {
    loaction: 'Montevideo',
    address: 'Mercedes 1789, esq. Tristán Narvaja',
    whatsApp: {
      number: 598097530690,
      text: '097 530 690',
    },
    position: { lat: -34.900745, lng: -56.178579 },
  },
  {
    loaction: 'Las Piedras',
    address: 'Av. Dr. Enrique Pouey 711, esq. Aparicio Saravia',
    whatsApp: {
      number: 598092555609,
      text: '092 555 609',
    },
    position: { lat: -34.7308552, lng: -56.2236266 },
  },
];

type FooterMapProps = {
  loaction: string;
  address: string;
  whatsApp: {
    number: number;
    text: string;
  };
  position: { lat: number; lng: number };
};

const FooterMap: FC<FooterMapProps> = ({ loaction, address, whatsApp, position }) => (
  <div>
    <Flex justifyContent="space-between" alignItems="center">
      <Heading as="h4" fontSize={_branchNameSize} textTransform="uppercase" fontWeight="bolder">
        {loaction}
      </Heading>
      <AnimationWrapper tag="a">
        <Link
          as={NextLink}
          href={`https://wa.me/${whatsApp.number}`}
          rel="noopener noreferrer"
          target="_blank"
          textDecoration="none"
          fontFamily="Play"
          _hover={{ color: _primaryColor }}
        >
          <Flex alignItems="center" fontSize={_wspSize}>
            <Icon as={IoLogoWhatsapp} w={_wspIconSize} h={_wspIconSize} />
            <Box w=".5rem" />
            {whatsApp.text}
          </Flex>
        </Link>
      </AnimationWrapper>
    </Flex>
    <Box h="1rem" />
    <Map h={_mapH} position={position} zoom={16} />
    <Box h="1rem" />
    <Center color={_addressColor} fontSize=".8rem" letterSpacing=".05rem">
      {address}
    </Center>
  </div>
);

export const Footer = () => {
  const isLg = !!useBreakpointValue({
    base: false,
    lg: true,
  });
  const rotateDeg = isLg ? 12 : 8;
  return (
    <Box bg={_bg} pt="1rem" pb="4rem" color={_color}>
      <Container p="0">
        <Center p="4rem 0 3rem 0">
          <AnimationWrapper tag="a">
            <SocialNeworks dark color={_color} size="2rem" gap="2rem" hide={['whatsapp']} />
          </AnimationWrapper>
        </Center>
        <Grid
          p={{ base: '2rem', md: '2rem' }}
          gridTemplateColumns={{ base: '1fr', md: '1fr 1fr' }}
          gap={{ base: '2rem', xl: '4rem' }}
        >
          {branches.map((branch, i) => (
            <div
              key={i}
              style={{
                perspective: 2000,
                transformStyle: 'preserve-3d',
              }}
            >
              <Box
                transform={
                  i === 0
                    ? `rotateY(${rotateDeg}deg) ${isLg ? '' : 'translateX(1.1%)'}`
                    : `rotateY(-${rotateDeg}deg) ${isLg ? '' : 'translateX(-1.1%)'}`
                }
                borderTop="solid 1px #ffffff30"
                pt="4rem"
                pb="2rem"
              >
                <FooterMap {...branch} />
              </Box>
            </div>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};
