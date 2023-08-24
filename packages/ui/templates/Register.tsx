import { Box, Container, Heading, Button, Grid, GridItem } from 'ui';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { Formik, Field } from 'formik';
import { Link, FormControl, FormLabel, Input, Select, FormErrorMessage } from '@chakra-ui/react';
import { useState, FC } from 'react';

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

const _backgroundColorOne = 'brand.login.backgroundColorOne';
const _backgroundGradient = `linear(to-b, ${_backgroundColorOne} 50%, transparent 50%)`;

const _backButtonHover = { color: 'brand.login.backgroundColorOne', backgroundColor: 'white' };
const _loginButtonBg = 'brand.login.backgroundColorOne';

const _containerW = { md: '45rem', base: '90%' };
const _formControlW = { md: '20rem', base: '100%' };

const _gridTemplateAreas = {
  md: `"firstName lastName" "email email" "password passwordConfirm" "phone address" "department location" "submit submit"`,
  base: `"firstName" "lastName" "email" "password" "passwordConfirm" "phone" "address" "department" "location" "submit"`,
};

type RegisterProps = {
  Logo: FC;
};

type RegisterValues = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  personId: string;
  roles: Array<string>;
};

export const Register: FC<RegisterProps> = ({ Logo }) => {
  const states = useStateList();
  const cities = useCityList();
  const [registerProps, setRegisterProps] = useState<RegisterValues>();
  const { isLoading, data, error } = useAddUser(registerProps);
  console.log(data);
  const statesSelect = () => {
    return states?.data?.map(state => (
      <option key={state.id} value={state.id}>
        {state.name}
      </option>
    ));
  };

  const citiesSelect = (id: any) => {
    return cities?.data?.map(city =>
      city.stateId === id ? (
        <option key={city.id} value={city.id}>
          {city.name}
        </option>
      ) : null,
    );
  };

  const [selectedState, setSelectedState] = useState(null);

  const handleStateChange = (e: any) => {
    setSelectedState(e.target.value);
  };

  const [password, setPassword] = useState('');

  return (
    <Box>
      <Box height={'100vh'} bgGradient={_backgroundGradient}>
        <Box p={'1.5rem'} display={'flex'} justifyContent={{ base: 'center', lg: 'start' }}>
          <Logo />
        </Box>
        <Container
          maxW={_containerW}
          color={'white'}
          mt={'5rem'}
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
        <Container
          maxW={_containerW}
          minH={'20rem'}
          bg={'white'}
          boxShadow={'lg'}
          borderRadius={'0.5rem'}
          p={'2rem 2rem 1rem 2rem'}
        >
          <Formik
            initialValues={{
              firstName: '',
              lastName: '',
              email: '',
              password: '',
              passwordConfirm: '',
              phone: '',
              address: '',
              department: '',
              location: '',
            }}
            onSubmit={values => {
              setRegisterProps({
                ...values,
                password,
                id: '8787787',
                personId: '8787787',
                roles: [],
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
                    <FormControl isInvalid={!!errors.email}>
                      <FormLabel htmlFor="email">Correo electrónico</FormLabel>
                      <Field
                        as={Input}
                        id="email"
                        name="email"
                        type="text"
                        variant="filled"
                        _focus={{ borderColor: 'primary.main' }}
                        validate={(value: any) => {
                          return validateEmail(value);
                        }}
                      />
                      <FormErrorMessage>{errors.firstName}</FormErrorMessage>
                    </FormControl>
                  </GridItem>
                  <GridItem gridArea={'password'}>
                    <FormControl width={_formControlW} isInvalid={!!errors.password}>
                      <FormLabel htmlFor="password">Contraseña</FormLabel>
                      <Field
                        as={Input}
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
                        id="phone"
                        name="phone"
                        type="number"
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
                  <GridItem gridArea={'department'}>
                    <FormControl width={_formControlW} isInvalid={!!errors.department}>
                      <FormLabel htmlFor="department">Departamento</FormLabel>
                      <Field
                        as={Select}
                        onChange={handleStateChange}
                        value={selectedState}
                        id="department"
                        name="department"
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
                      <FormErrorMessage>{errors.department}</FormErrorMessage>
                    </FormControl>
                  </GridItem>
                  <GridItem gridArea={'location'}>
                    <FormControl width={_formControlW} isInvalid={!!errors.location}>
                      <FormLabel htmlFor="location">Localidad</FormLabel>
                      <Field
                        as={Select}
                        id="location"
                        name="location"
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
                      <FormErrorMessage>{errors.location}</FormErrorMessage>
                    </FormControl>
                  </GridItem>

                  <GridItem gridArea={'submit'} mt={'1rem'}>
                    <Button type="submit" bg={_loginButtonBg} color={'white'} width="100%" mb={'0.75rem'}>
                      Registrarse
                    </Button>
                  </GridItem>
                </Grid>
              </form>
            )}
          </Formik>
        </Container>
        <Box py={'2rem'}></Box>
      </Box>
    </Box>
  );
};
