import dynamic from 'next/dynamic';
import NextLink from 'next/link';
import { useState } from 'react';
import {
  Box,
  Container,
  Flex,
  GaPage,
  Head,
  Heading,
  Text,
} from 'ui';
import { AnimationWrapper } from 'ui';
import { IoLogoWhatsapp } from 'react-icons/io5';
import { MdLocationOn, MdSchedule, MdDirections } from 'react-icons/md';
import { Icon, Link } from '@chakra-ui/react';
import { branches } from 'shared';
import { NavBar } from '../components';
import { Footer } from '../components/Footer';

// Carga dinámica del mapa — Leaflet requiere window (solo cliente), nunca SSR
const LeafletMap = dynamic(
  () => import('../components/LeafletMap').then(m => m.LeafletMap),
  { ssr: false, loading: () => <Box w="100%" h="100%" bg="brand.grey.0" /> }
);

// Paleta del CONTENIDO del sitio (theme/index.ts): claro, como el detalle de
// producto y la página Empresa. El negro es SOLO el footer.
const _accent = '#d7fc00';            // secondary (amarillo de marca)
const _bodyBg = 'brand.grey.0';       // #F7F7F7 — fondo del body
const _border = '#e2e2e2';            // borde del detalle de producto
const _textTitle = 'black';
const _textBody = 'brand.grey.3';     // #3E4448
const _textMuted = 'brand.grey.2';    // #7D7D7D
const _selectedBg = '#f0f0f0';        // gris neutro — el verde queda solo como acento lateral
const _hoverBg = 'brand.grey.0';      // #F7F7F7
const _shadowMd = '0px 4px 16px 0px rgba(0, 0, 0, .1), 0 2px 4px -1px rgba(0, 0, 0, .1)';

// "Cómo llegar" — usa coords (funciona aunque mapUrl sea placeholder)
const directionsUrl = (p: { lat: number; lng: number }) =>
  `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`;

type Branch = (typeof branches)[number];

type BranchListItemProps = {
  branch: Branch;
  isSelected: boolean;
  isLast: boolean;
  onSelect: () => void;
};

const BranchListItem = ({ branch, isSelected, isLast, onSelect }: BranchListItemProps) => (
  <Box
    as="button"
    textAlign="left"
    w="100%"
    px="1.5rem"
    py="1.15rem"
    cursor="pointer"
    bg={isSelected ? _selectedBg : 'transparent'}
    borderLeft={isSelected ? '3px solid black' : '3px solid transparent'}
    borderBottom={isLast ? 'none' : '1px solid'}
    borderBottomColor={_border}
    transition="background 0.15s, border-color 0.15s"
    _hover={{ bg: isSelected ? _selectedBg : _hoverBg }}
    onClick={onSelect}
  >
    {/* Nombre */}
    <Heading
      as="h3"
      fontSize="1.1rem"
      textTransform="uppercase"
      fontWeight="bolder"
      color={_textTitle}
      fontFamily="Play"
      mb=".5rem"
      noOfLines={1}
    >
      {branch.location}
    </Heading>

    {/* Dirección */}
    <Flex alignItems="flex-start" gap=".5rem" mb=".35rem">
      <Icon as={MdLocationOn} color={_textMuted} boxSize="1.05em" mt=".1em" flexShrink={0} />
      <Text fontSize=".85rem" color={_textBody} lineHeight="1.4">
        {branch.address}
      </Text>
    </Flex>

    {/* Horario */}
    <Flex alignItems="flex-start" gap=".5rem" mb=".85rem">
      <Icon as={MdSchedule} color={_textMuted} boxSize="1.05em" mt=".1em" flexShrink={0} />
      <Text fontSize=".78rem" color={_textMuted} lineHeight="1.4">
        {branch.schedule}
      </Text>
    </Flex>

    {/* Acciones */}
    <Flex gap=".6rem" alignItems="center">
      {/* Cómo llegar — botón negro (primary) */}
      <Link
        as={NextLink}
        href={directionsUrl(branch.position)}
        rel="noopener noreferrer"
        target="_blank"
        textDecoration="none"
        bg="black"
        color="white"
        fontFamily="Play"
        fontWeight="bold"
        fontSize=".8rem"
        px=".85rem"
        py=".5rem"
        borderRadius="md"
        _hover={{ bg: '#2a2a2a' }}
        onClick={e => e.stopPropagation()}
      >
        <Flex alignItems="center" gap=".35rem">
          <Icon as={MdDirections} boxSize="1.25em" />
          Cómo llegar
        </Flex>
      </Link>
      {/* WhatsApp — link */}
      <AnimationWrapper tag="a">
        <Link
          as={NextLink}
          href={`https://wa.me/${branch.whatsApp.number}`}
          rel="noopener noreferrer"
          target="_blank"
          textDecoration="none"
          color={_textBody}
          fontFamily="Play"
          fontSize=".82rem"
          _hover={{ color: 'black' }}
          onClick={e => e.stopPropagation()}
        >
          <Flex alignItems="center" gap=".4rem">
            <Icon as={IoLogoWhatsapp} boxSize="1.2em" color="#25D366" />
            {branch.whatsApp.text}
          </Flex>
        </Link>
      </AnimationWrapper>
    </Flex>
  </Box>
);

const ContactPage = () => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const selectedBranch = branches[selectedIdx];

  return (
    <GaPage page="Contacto">
      <Box bg={_bodyBg} minH="100vh">
        <Head />
        <NavBar />

        <Container maxW="75rem" px={{ base: '1rem', md: '1.5rem' }} pt={{ base: '1.5rem', lg: '2.5rem' }}>
          {/* Título */}
          <Box mb={{ base: '1.25rem', md: '1.75rem' }}>
            <Heading
              as="h1"
              fontSize={{ base: '1.6rem', md: '2rem' }}
              textTransform="uppercase"
              letterSpacing=".08rem"
              color={_textTitle}
            >
              Nuestras Sucursales
            </Heading>
            <Text fontSize={{ base: '.9rem', md: '1rem' }} color={_textMuted} mt=".35rem">
              {branches.length} locales en Uruguay · tocá una sucursal para verla en el mapa
            </Text>
          </Box>

          {/* Lista (izq) + Mapa (der). En mobile: mapa arriba, lista abajo. */}
          <Flex
            direction={{ base: 'column', lg: 'row' }}
            h={{ lg: '580px' }}
            bg="white"
            borderRadius="0.5rem"
            border="1px solid"
            borderColor={_border}
            boxShadow={_shadowMd}
            overflow="hidden"
          >
            {/* Lista de sucursales */}
            <Box
              w={{ base: '100%', lg: '380px' }}
              flexShrink={0}
              h={{ base: 'auto', lg: '100%' }}
              overflowY={{ lg: 'auto' }}
              borderRight={{ lg: '1px solid' }}
              borderRightColor={{ lg: _border }}
              css={{
                '&::-webkit-scrollbar': { width: '6px' },
                '&::-webkit-scrollbar-track': { background: '#f0f0f0' },
                '&::-webkit-scrollbar-thumb': { background: '#cccccc', borderRadius: '4px' },
              }}
            >
              {branches.map((branch, i) => (
                <BranchListItem
                  key={i}
                  branch={branch}
                  isSelected={i === selectedIdx}
                  isLast={i === branches.length - 1}
                  onSelect={() => setSelectedIdx(i)}
                />
              ))}
            </Box>

            {/* Mapa — enfoca la sucursal seleccionada (zoom cercano, un solo pin) */}
            <Box flex="1" h={{ base: '320px', lg: '100%' }} order={{ base: -1, lg: 0 }}>
              <LeafletMap center={selectedBranch.position} zoom={16} height="100%" />
            </Box>
          </Flex>
        </Container>

        <Box h="6rem" />
        <Footer />
      </Box>
    </GaPage>
  );
};

export default ContactPage;
