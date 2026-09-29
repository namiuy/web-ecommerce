import NextLink from 'next/link';
import { AnimationWrapper, Box, Container, Flex, Heading } from 'ui';
import SocialNetworks from 'ui/components/SocialNetworks';
import { Link, Text, Divider } from '@chakra-ui/react';
import { Logo } from './Logo';

const _bg = '#060606';
const _color = '#d5d5d5';
const _muted = '#8a8a8a';
const _link = '#C9C9C9';      // texto opaco como el nav (brand.grey.1)
const _subtitle = '#9a9a9a';  // subtítulos con opacidad

const navLinks = [
  { text: 'Inicio', href: '/' },
  { text: 'Productos', href: '/productos' },
  { text: 'Empresa', href: '/empresa' },
  { text: 'Sucursales', href: '/sucursales' },
];

const colHeading = {
  as: 'h4' as const,
  fontFamily: 'Play',
  fontSize: '.95rem',
  textTransform: 'uppercase' as const,
  letterSpacing: '.05rem',
  color: _subtitle,
  mb: '1rem',
};

export const Footer = () => (
  <Box bg={_bg} color={_color} pt="3.5rem" pb="2rem">
    <Container p="0" px={{ base: '1.5rem', md: '2rem' }}>
      <Flex
        direction={{ base: 'column', md: 'row' }}
        justifyContent="space-between"
        gap={{ base: '2.5rem', md: '2rem' }}
        mb="3rem"
      >
        {/* Marca */}
        <Box maxW={{ md: '22rem' }}>
          <Logo viewBox="0 0 165 48" width={230} height={67} />
          <Text fontSize=".88rem" color={_muted} lineHeight="1.55" mt="1.25rem">
            Motos, bicicletas, cuatriciclos, utilitarios e indumentaria, con la financiación más fácil del Uruguay. Hacé realidad el sueño de tu próximo vehículo.
          </Text>
        </Box>

        {/* Navegación */}
        <Box>
          <Heading {...colHeading}>Navegación</Heading>
          <Flex direction="column" gap=".7rem">
            {navLinks.map(l => (
              <Link
                key={l.href}
                as={NextLink}
                href={l.href}
                fontSize=".9rem"
                color={_link}
                textDecoration="none"
                _hover={{ color: 'white' }}
              >
                {l.text}
              </Link>
            ))}
          </Flex>
        </Box>

        {/* Seguinos */}
        <Box>
          <Heading {...colHeading}>Seguinos en</Heading>
          <AnimationWrapper tag="a">
            <SocialNetworks dark color={_color} size="1.7rem" gap="1.25rem" hide={['whatsapp']} hover />
          </AnimationWrapper>
          <Text fontSize=".8rem" color={_muted} mt="1rem">
            @credibikerss
          </Text>
        </Box>
      </Flex>

      <Divider borderColor="rgba(255,255,255,.12)" mb="1.5rem" />

      <Text fontSize=".78rem" color={_muted}>
        © 2026 Credibikerss · Todos los derechos reservados.
      </Text>
    </Container>
  </Box>
);
