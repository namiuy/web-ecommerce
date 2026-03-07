import lscache from 'lscache';
import { Box, Container, Flex, Heading, Skeleton, Text } from 'ui';
import { ArrowBackIcon, EditIcon } from '@chakra-ui/icons';
import { Link, useDisclosure } from '@chakra-ui/react';
import { FC, useEffect, useState } from 'react';
import { ModalPassword } from '../components/ModalPassword';
import { ModalName } from '../components/ModalName';
import { isBrowser, useGetPerson } from 'shared';
import { TiPlus } from 'react-icons/ti';
import { ModalNewPhone } from '../components/ModalNewPhone';
import { ModalEditPhone } from '../components/ModalEditPhone';
import { ModalNewAddress } from '../components/ModalNewAddress';
import { ModalEditAddress } from '../components/ModalEditAddress';
import { useRouter } from 'next/router';

const _backgroundColorOne = 'brand.profile.backgroundColorOne';
const _backgroundColorTwo = 'brand.profile.backgroundColorTwo';
const _backgroundGradient = `linear(to-b, ${_backgroundColorOne} 30rem, transparent 50%)`;
const _subtitlesColor = 'brand.profile.subtitlesColor';
const _backButtonHover = {
  color: 'brand.profile.backButton._hover.color',
  bg: 'brand.profile.backButton._hover.backgroundColor',
};

type ProfileProps = {
  Logo: FC;
};

export const Profile = ({ Logo }: ProfileProps) => {
  const issBrowser = isBrowser();
  const router = useRouter();

  useEffect(() => {
    if (issBrowser) {
      const user = lscache.get('user'); // TODO: improve this
      if (!user || !user.id) {
        router.push('/');
      }
    }
  }, [issBrowser]);

  const { isOpen: isOpenFirst, onOpen: onOpenFirst, onClose: onCloseFirst } = useDisclosure();
  const { isOpen: isOpenSecond, onOpen: onOpenSecond, onClose: onCloseSecond } = useDisclosure();
  const { isOpen: isOpenThird, onOpen: onOpenThird, onClose: onCloseThird } = useDisclosure();
  const { isOpen: isOpenFourth, onOpen: onOpenFourth, onClose: onCloseFourth } = useDisclosure();
  const { isOpen: isOpenFifth, onOpen: onOpenFifth, onClose: onCloseFifth } = useDisclosure();
  const { isOpen: isOpenSixth, onOpen: onOpenSixth, onClose: onCloseSixth } = useDisclosure();

  const [editPhone, setEditPhone] = useState<string>();
  const [editAddress, setEditAddress] = useState<string>();
  const [editCityId, setEditCityId] = useState<string>();
  const [editCityName, setEditCityName] = useState<string>();
  const [editStateId, setEditStateId] = useState<string>();
  const [editStateName, setEditStateName] = useState<string>();
  const [editPostalCode, setEditPostalCode] = useState<string>();

  const id = lscache.get('user')?.id;
  const personId = lscache.get('user')?.personId;
  const { data, isLoading, error } = useGetPerson(personId);

  const [personData, setPersonData] = useState(data);

  useEffect(() => {
    if (data) {
      setPersonData({ ...data });
    }
  }, [data]);

  const redirectTo = router.query.redirectTo as string;

  useEffect(() => {
    if (redirectTo === 'checkout') {
      onOpenFifth();
    }
  }, [redirectTo]);

  const handlePhoneChange = (phone: string) => {
    setEditPhone(phone);
    onOpenFourth();
  };

  const handleAddressChange = (
    address: string,
    city_id: string,
    city_name: string,
    state_id: string,
    state_name: string,
    postal_code: string,
  ) => {
    setEditAddress(address);
    setEditCityId(city_id);
    setEditCityName(city_name);
    setEditStateId(state_id);
    setEditStateName(state_name);
    setEditPostalCode(postal_code);
    onOpenSixth();
  };

  const sortedPhones = personData?.phones?.slice().sort((a, b) => {
    return a.number === personData?.default_phone ? -1 : 1;
  });

  const sortedAddresses = personData?.addresses?.slice().sort((a, b) => {
    return a.address === personData?.default_address ? -1 : 1;
  });

  return (
    <>
      <Box bg={_backgroundColorTwo} minH="100vh" pb="5rem">
        <Box bgGradient={_backgroundGradient} minH="40rem">
          <Link href="/" p="1.5rem" display="flex" justifyContent={{ base: 'center', lg: 'start' }}>
            <Logo />
          </Link>
          <Container
            maxW="37rem"
            color="white"
            mt="5rem"
            mb="1rem"
            px="0"
            display="flex"
            justifyContent={{ base: 'space-around', lg: 'space-between' }}
            alignItems="center"
          >
            <Link href="/" borderRadius="50%" p="0.25rem" _hover={_backButtonHover}>
              <ArrowBackIcon boxSize="6" />
            </Link>
            <Heading fontSize="2rem">Mi perfil</Heading>
            <Box w="2rem"> &nbsp;</Box>
          </Container>
          <Container
            maxW={{ base: '90%', md: '37rem' }}
            minH="15rem"
            bg="white"
            boxShadow="lg"
            borderRadius="0.5rem"
            p="2rem"
          >
            <Box mb="1rem">
              <Text fontWeight="bold" fontSize="1.125rem" mb="0.25rem" color={_subtitlesColor}>
                DATOS PERSONALES
              </Text>
              <Flex
                w="100%"
                gap={{ base: '0.5rem', lg: '0' }}
                alignItems={{ base: 'start', lg: 'center' }}
                flexDir={{ base: 'column', lg: 'row' }}
                borderBottom="1px"
                borderColor="blackAlpha.200"
                p={{ base: '1rem 1.25rem 1rem 0.75rem', lg: '1.25rem' }}
              >
                <Box w="50%">
                  <Text fontSize="0.938rem" fontWeight="medium">
                    Correo electrónico
                  </Text>
                </Box>
                {isLoading ? (
                  <Skeleton w="10rem" h="1.25rem" />
                ) : (
                  <Box>
                    <Text fontSize="0.875rem">{personData?.email}</Text>
                  </Box>
                )}
              </Flex>
              <Flex
                alignItems={{ base: 'start', lg: 'center' }}
                w="100%"
                gap={{ base: '0.5rem', lg: '0' }}
                flexDir={{ base: 'column', lg: 'row' }}
                borderBottom="1px"
                borderColor="blackAlpha.200"
                cursor="pointer"
                p={{ base: '1rem 1.25rem 1rem 0.75rem', lg: '1.25rem' }}
                _hover={{ bg: 'blackAlpha.50' }}
                onClick={onOpenFirst}
              >
                <Box w="50%">
                  <Text fontSize="0.938rem" fontWeight="medium">
                    Contraseña
                  </Text>
                </Box>
                <Flex justifyContent="space-between" w={{ base: '100%', lg: '50%' }}>
                  {isLoading ? (
                    <Skeleton w="10rem" h="1.25rem" />
                  ) : (
                    <Box>
                      <Text fontSize="0.875rem">**********</Text>
                    </Box>
                  )}
                  <EditIcon />
                </Flex>
              </Flex>
              <ModalPassword isOpen={isOpenFirst} onClose={onCloseFirst} />
              <Flex
                alignItems={{ base: 'start', lg: 'center' }}
                w="100%"
                gap={{ base: '0.5rem', lg: '0' }}
                flexDir={{ base: 'column', lg: 'row' }}
                cursor="pointer"
                p={{ base: '1rem 1.25rem 1rem 0.75rem', lg: '1.25rem' }}
                _hover={{ bg: 'blackAlpha.50' }}
                onClick={onOpenSecond}
              >
                <Box w="50%">
                  <Text fontSize="0.938rem" fontWeight="medium">
                    Nombre y apellido
                  </Text>
                </Box>
                <Flex justifyContent="space-between" w={{ base: '100%', lg: '50%' }}>
                  {isLoading ? (
                    <Skeleton w="10rem" h="1.25rem" />
                  ) : (
                    <Box>
                      <Text fontSize="0.875rem">
                        {personData?.name} {personData?.last_name}
                      </Text>
                    </Box>
                  )}
                  <EditIcon />
                </Flex>
              </Flex>
              {personData && (
                <ModalName
                  id={id}
                  personId={personId}
                  name={personData?.name}
                  lastName={personData?.last_name}
                  isOpen={isOpenSecond}
                  onClose={onCloseSecond}
                  setPersonData={setPersonData}
                />
              )}
            </Box>
            <Box mb="1rem">
              <Flex color={_subtitlesColor} justifyContent="space-between" alignItems="center" mb="0.5rem">
                <Text fontWeight="bold" fontSize="1.125rem">
                  TELÉFONOS
                </Text>
                <Flex alignItems="center" gap="0.25rem" cursor="pointer" onClick={onOpenThird} p="0.25rem">
                  <Text fontSize="0.875rem" fontWeight="medium">
                    Nuevo
                  </Text>
                  <TiPlus />
                </Flex>
                <ModalNewPhone
                  id={id}
                  personId={personId}
                  isOpen={isOpenThird}
                  onClose={onCloseThird}
                  setPersonData={setPersonData}
                />
              </Flex>
              {isLoading ? (
                <Flex
                  justifyContent="space-between"
                  alignItems="center"
                  w="100%"
                  cursor="pointer"
                  p={{ base: '1.25rem 0.75rem', lg: '1.25rem' }}
                  _hover={{ bg: 'blackAlpha.50' }}
                >
                  <Skeleton w="10rem" h="1.375rem" />
                  <EditIcon />
                </Flex>
              ) : (
                <>
                  {sortedPhones?.map((phone, i) => (
                    <Flex
                      key={`${phone.number}-${i}-${personData?.default_phone}`}
                      justifyContent="space-between"
                      alignItems="center"
                      w="100%"
                      borderBottom={i === sortedPhones.length - 1 ? 'none' : '1px'}
                      borderColor="blackAlpha.200"
                      cursor="pointer"
                      p={{ base: '1rem 1.25rem 1rem 0.75rem', lg: '1.25rem' }}
                      _hover={{ bg: 'blackAlpha.50' }}
                      onClick={() => handlePhoneChange(phone.number)}
                    >
                      <Flex alignItems="center" gap="0.75rem">
                        <Text fontSize="0.938rem">{phone.number}</Text>
                        {personData?.default_phone == phone.number && (
                          <Text
                            borderRadius="1rem"
                            border="1px"
                            borderColor={_subtitlesColor}
                            color={_subtitlesColor}
                            fontSize="0.75rem"
                            px="0.5rem"
                            fontWeight="medium"
                          >
                            DEFECTO
                          </Text>
                        )}
                      </Flex>
                      <EditIcon />
                    </Flex>
                  ))}
                </>
              )}
              <ModalEditPhone
                id={id}
                personId={personId}
                isOpen={isOpenFourth}
                onClose={() => {
                  setEditPhone(undefined);
                  onCloseFourth();
                }}
                phone={editPhone}
                defaultPhone={personData?.default_phone}
                setPersonData={setPersonData}
              />
            </Box>
            <Box>
              <Flex color={_subtitlesColor} justifyContent="space-between" alignItems="center" mb="0.5rem">
                <Text fontWeight="bold" fontSize="1.125rem">
                  DIRECCIONES
                </Text>
                <Flex alignItems="center" gap="0.25rem" onClick={onOpenFifth} cursor="pointer">
                  <Text fontSize="0.875rem" fontWeight="medium">
                    Nuevo
                  </Text>
                  <TiPlus />
                </Flex>
                <ModalNewAddress
                  id={id}
                  personId={personId}
                  isOpen={isOpenFifth}
                  onClose={onCloseFifth}
                  setPersonData={setPersonData}
                  redirectTo={redirectTo}
                />
              </Flex>
              {isLoading ? (
                <Flex
                  justifyContent="space-between"
                  alignItems="center"
                  w="100%"
                  cursor="pointer"
                  p={{ base: '1.25rem 0.75rem', lg: '1.25rem' }}
                  _hover={{ bg: 'blackAlpha.50' }}
                >
                  <Skeleton w="10rem" h="1.375rem" />
                  <EditIcon />
                </Flex>
              ) : (
                <>
                  {sortedAddresses?.map((address, i) => (
                    <Flex
                      key={`${address.address}-${i}-${personData?.default_address}`}
                      justifyContent="space-between"
                      alignItems="center"
                      w="100%"
                      borderBottom={i === sortedAddresses.length - 1 ? 'none' : '1px'}
                      borderColor="blackAlpha.200"
                      cursor="pointer"
                      gap={{ base: '1rem', lg: '0' }}
                      p={{ base: '1rem 1.25rem 1rem 0.75rem', lg: '1.25rem' }}
                      _hover={{ bg: 'blackAlpha.50' }}
                      onClick={() =>
                        handleAddressChange(
                          address.address,
                          address.city_id,
                          address.city_name,
                          address.state_id,
                          address.state_name,
                          address.postal_code,
                        )
                      }
                    >
                      <Flex alignItems="center" gap="0.75rem">
                        <Text fontSize="0.938rem">
                          {address.address}, {address.city_name}, {address.state_name}
                        </Text>
                        {personData?.default_address == address.address && (
                          <Text
                            borderRadius="1rem"
                            border="1px"
                            borderColor={_subtitlesColor}
                            color={_subtitlesColor}
                            fontSize="0.75rem"
                            px="0.5rem"
                            fontWeight="medium"
                          >
                            DEFECTO
                          </Text>
                        )}
                      </Flex>
                      <EditIcon />
                    </Flex>
                  ))}
                </>
              )}
              <ModalEditAddress
                id={id}
                personId={personId}
                address={editAddress!}
                city_id={editCityId!}
                city_name={editCityName!}
                state_id={editStateId!}
                state_name={editStateName!}
                postal_code={editPostalCode!}
                default_address={personData?.default_address}
                isOpen={isOpenSixth}
                onClose={onCloseSixth}
                setPersonData={setPersonData}
              />
            </Box>
          </Container>
        </Box>
      </Box>
    </>
  );
};
