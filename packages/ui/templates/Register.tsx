import { Link, FormControl, FormLabel, Input, Select, FormErrorMessage, Progress, Icon } from '@chakra-ui/react';
import { Box, Container, Heading, Button, Grid, GridItem, Text } from 'ui';
import { Formik, Field } from 'formik';
import { useState, FC } from 'react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { BsFillCheckCircleFill } from 'react-icons/bs';

import { useStateList } from 'shared/hooks/request/state';
import { useCityList } from 'shared/hooks/request/city';
import {
  validateEmpty,
  validateEmptySelect,
  validatePassword,
  validateEmail,
  validateRepeatPassword,
  useAddUser,
} from 'shared';
import { State } from 'shared/entities/state';
import { City } from 'shared/entities/city';
import { UserAdd } from 'shared/entities/user-add';

const EMAIL_ALREADY_IN_USE = 'Email already in use';

const _backgroundColorOne = 'brand.login.backgroundColorOne';
const _backgroundGradient = `linear(to-b, ${_backgroundColorOne} 50%, transparent 50%)`;

const _backButtonHover = { color: 'brand.login.backgroundColorOne', backgroundColor: 'white' };
const _loginButtonBg = 'brand.login.backgroundColorOne';

const _containerW = { md: '45rem', base: '90%' };
const _formControlW = { md: '20rem', base: '100%' };

const _gridTemplateAreas = {
  md: `"firstName lastName" "email email" "password passwordConfirm" "phone address" "state city" "progress progress" "submit submit"`,
  base: `"firstName" "lastName" "email" "password" "passwordConfirm" "phone" "address" "state" "city" "progress" "submit"`,
};

type RegisterProps = {
  Logo: FC;
};

export const Register: FC<RegisterProps> = ({ Logo }) => {
  const states = useStateList();
  const cities = useCityList();
  const [password, setPassword] = useState('');
  const [selectedState, setSelectedState] = useState(null);
  const [registerProps, setRegisterProps] = useState<UserAdd>();
  const { isLoading, data, error } = useAddUser(registerProps);
  const emailInUseError = error === EMAIL_ALREADY_IN_USE;

  {
    data && console.log('Se ha registrado exitosamente!');
  }

  const statesSelect = () => {
    return states?.data?.map((state: State) => (
      <option key={state.id} value={state.id}>
        {state.name}
      </option>
    ));
  };

  const citiesSelect = (id: any) => {
    return cities?.data?.map((city: City) =>
      city.stateId === id ? (
        <option key={city.id} value={city.id}>
          {city.name}
        </option>
      ) : null,
    );
  };

  return (
    <Box>
      <Box height={'100vh'} bgGradient={_backgroundGradient}>
        <Box p={'1.5rem'} display={'flex'} justifyContent={{ base: 'center', lg: 'start' }}>
          <Logo />
        </Box>
        <Container
          maxW={_containerW}
          color={'white'}
          mb={'1rem'}
          px={0}
          display={'flex'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Link borderRadius={'50%'} p={'0.25rem'} _hover={_backButtonHover}>
            {' '}
            <ArrowBackIcon boxSize={'6'} />
          </Link>
          <Heading size={'lg'} display={'inline-block'}>
            Completa tus datos
          </Heading>
          <Box width={'2rem'}> &nbsp;</Box>
        </Container>
        <Container maxW={_containerW} minH={'30rem'} bg={'white'} boxShadow={'lg'} borderRadius={'0.5rem'} p={'2rem'}>
          {!data && (
            <Formik
              initialValues={{
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                passwordConfirm: '',
                phone: '',
                address: '',
                state: '',
                city: '',
              }}
              onSubmit={values => {
                setRegisterProps({
                  firstName: values.firstName,
                  lastName: values.lastName,
                  email: values.email,
                  password: password,
                  phone: values.phone,
                  address: values.address,
                  state: selectedState ?? -1,
                  city: Number(values.city),
                });
              }}
              validateOnChange={false}
              validateOnBlur={false}
            >
              {({ handleSubmit, errors }) => (
                <form onSubmit={handleSubmit}>
                  <Grid gridTemplateAreas={_gridTemplateAreas} gap={'1rem'}>
                    <GridItem gridArea={'firstName'}>
                      <FormControl width={_formControlW} isInvalid={!!errors.firstName}>
                        <FormLabel htmlFor="firstName">Nombre</FormLabel>
                        <Field
                          as={Input}
                          disabled={isLoading}
                          dis
                          id="firstName"
                          name="firstName"
                          type="text"
                          variant="filled"
                          _focus={{ borderColor: 'primary.main' }}
                          validate={(value: any) => {
                            return validateEmpty(value);
                          }}
                        />
                        <FormErrorMessage>{errors.firstName}</FormErrorMessage>
                      </FormControl>
                    </GridItem>
                    <GridItem gridArea={'lastName'}>
                      <FormControl width={_formControlW} isInvalid={!!errors.lastName}>
                        <FormLabel htmlFor="lastName">Apellido</FormLabel>
                        <Field
                          as={Input}
                          disabled={isLoading}
                          id="lastName"
                          name="lastName"
                          type="text"
                          variant="filled"
                          _focus={{ borderColor: 'primary.main' }}
                          validate={(value: any) => {
                            return validateEmpty(value);
                          }}
                        />
                        <FormErrorMessage>{errors.lastName}</FormErrorMessage>
                      </FormControl>
                    </GridItem>
                    <GridItem gridArea={'email'}>
                      <FormControl isInvalid={!!errors.email || emailInUseError}>
                        <FormLabel htmlFor="email">Correo electrónico</FormLabel>
                        <Field
                          as={Input}
                          disabled={isLoading}
                          id="email"
                          name="email"
                          type="text"
                          variant="filled"
                          _focus={{ borderColor: 'primary.main' }}
                          validate={(value: any) => {
                            return validateEmail(value);
                          }}
                        />
                        <FormErrorMessage>
                          {emailInUseError ? 'El email ya se encuentra en uso' : errors.email}
                        </FormErrorMessage>
                      </FormControl>
                    </GridItem>
                    <GridItem gridArea={'password'}>
                      <FormControl width={_formControlW} isInvalid={!!errors.password}>
                        <FormLabel htmlFor="password">Contraseña</FormLabel>
                        <Field
                          as={Input}
                          disabled={isLoading}
                          id="password"
                          name="password"
                          type="password"
                          variant="filled"
                          _focus={{ borderColor: 'primary.main' }}
                          onChange={(e: any) => {
                            setPassword(e.target.value);
                          }}
                          value={password}
                          validate={() => {
                            return validatePassword(password);
                          }}
                        />
                        <FormErrorMessage>{errors.password}</FormErrorMessage>
                      </FormControl>
                    </GridItem>
                    <GridItem gridArea={'passwordConfirm'}>
                      <FormControl width={_formControlW} isInvalid={!!errors.passwordConfirm}>
                        <FormLabel htmlFor="passwordConfirm">Confirme su contraseña</FormLabel>
                        <Field
                          as={Input}
                          disabled={isLoading}
                          id="passwordConfirm"
                          name="passwordConfirm"
                          type="password"
                          variant="filled"
                          _focus={{ borderColor: 'primary.main' }}
                          validate={(value: any) => {
                            return validateRepeatPassword(value, password);
                          }}
                        />
                        <FormErrorMessage>{errors.passwordConfirm}</FormErrorMessage>
                      </FormControl>
                    </GridItem>
                    <GridItem gridArea={'phone'}>
                      <FormControl width={_formControlW} isInvalid={!!errors.phone}>
                        <FormLabel htmlFor="phone">Teléfono</FormLabel>
                        <Field
                          as={Input}
                          disabled={isLoading}
                          id="phone"
                          name="phone"
                          type="text"
                          variant="filled"
                          _focus={{ borderColor: 'primary.main' }}
                          validate={(value: any) => {
                            return validateEmpty(value);
                          }}
                        />
                        <FormErrorMessage>{errors.phone}</FormErrorMessage>
                      </FormControl>
                    </GridItem>
                    <GridItem gridArea={'address'}>
                      <FormControl width={_formControlW} isInvalid={!!errors.address}>
                        <FormLabel htmlFor="address">Dirección</FormLabel>
                        <Field
                          as={Input}
                          disabled={isLoading}
                          id="address"
                          name="address"
                          type="text"
                          variant="filled"
                          _focus={{ borderColor: 'primary.main' }}
                          validate={(value: any) => {
                            return validateEmpty(value);
                          }}
                        />
                        <FormErrorMessage>{errors.address}</FormErrorMessage>
                      </FormControl>
                    </GridItem>
                    <GridItem gridArea={'state'}>
                      <FormControl width={_formControlW} isInvalid={!!errors.state}>
                        <FormLabel htmlFor="state">Departamento</FormLabel>
                        <Field
                          as={Select}
                          disabled={isLoading}
                          onChange={(e: any) => {
                            setSelectedState(e.target.value);
                          }}
                          value={selectedState}
                          id="state"
                          name="state"
                          type="text"
                          variant="filled"
                          isDisabled={states.isLoading}
                          _focus={{ borderColor: 'primary.main' }}
                          validate={() => {
                            return validateEmptySelect(selectedState);
                          }}
                        >
                          <option value="-1">Seleccione un departamento...</option>
                          {statesSelect()}
                        </Field>
                        <FormErrorMessage>{errors.state}</FormErrorMessage>
                      </FormControl>
                    </GridItem>
                    <GridItem gridArea={'city'}>
                      <FormControl width={_formControlW} isInvalid={!!errors.city}>
                        <FormLabel htmlFor="city">Localidad</FormLabel>
                        <Field
                          as={Select}
                          id="city"
                          name="city"
                          type="text"
                          variant="filled"
                          isDisabled={cities.isLoading || !selectedState || selectedState === '-1'}
                          _focus={{ borderColor: 'primary.main' }}
                          validate={(value: any) => {
                            return validateEmptySelect(value) || validateEmptySelect(selectedState);
                          }}
                        >
                          <option value="-1">Seleccione una localidad...</option>
                          {citiesSelect(selectedState)}
                        </Field>
                        <FormErrorMessage>{errors.city}</FormErrorMessage>
                      </FormControl>
                    </GridItem>

                    <GridItem gridArea={'progress'}>
                      <Progress
                        h={isLoading ? '4px' : '1px'}
                        m="1rem 0"
                        size="xs"
                        isIndeterminate={isLoading}
                        colorScheme="primary"
                      />
                    </GridItem>

                    <GridItem gridArea={'submit'} mt={'1rem'}>
                      <Button
                        disabled={isLoading}
                        type="submit"
                        bg={_loginButtonBg}
                        color={'white'}
                        width="100%"
                        mb={'0.75rem'}
                      >
                        Registrarse
                      </Button>
                    </GridItem>
                  </Grid>
                </form>
              )}
            </Formik>
          )}
          {data && (
            <>
              <Box textAlign={'center'} pt={'9rem'}>
                <Icon as={BsFillCheckCircleFill} color={'green.500'} w={'2.5rem'} h={'2.5rem'}></Icon>
                <Text fontSize={'1.5rem'} fontWeight={'bold'}>
                  ¡Registro realizado con éxito!
                </Text>
                <Text fontSize={'1.375rem'}>Comprueba tu email para activar tu cuenta.</Text>
              </Box>
            </>
          )}
        </Container>
        <Box py={'2rem'}></Box>
      </Box>
    </Box>
  );
};
