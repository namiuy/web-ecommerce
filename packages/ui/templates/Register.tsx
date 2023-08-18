import { Box, Container, Heading, Button, Grid, GridItem } from 'ui';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { Formik, Field } from 'formik';
import { Link, FormControl, FormLabel, Input, Select } from '@chakra-ui/react';
import { useState, FC, use } from 'react';

import { useStateList } from 'shared/hooks/request/state';
import { useCityList } from 'shared/hooks/request/city';

const _backgroundColorOne = 'brand.login.backgroundColorOne';
const _backgroundColorTwo = 'brand.login.backgroundColorTwo';
const _backgroundGradient = `linear(to-b, ${_backgroundColorOne} 50%, transparent 50%)`;

const _backButtonHover = { color: 'brand.login.backgroundColorOne', backgroundColor: 'white' };
const _loginButtonBg = 'brand.login.backgroundColorOne';

type RegisterProps = {
  Logo: FC;
};

export const Register: FC<RegisterProps> = ({ Logo }) => {
  const states = useStateList();
  const cities = useCityList();

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

  return (
    <Box height={'100vh'} bg={_backgroundColorTwo}>
      <Box bgGradient={_backgroundGradient} h={'40rem'}>
        <Box p={'1.5rem'} display={'flex'} justifyContent={{ base: 'center', lg: 'start' }}>
          <Logo />
        </Box>
        <Container
          maxW={'45rem'}
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
          maxW={'45rem'}
          minH={'20rem'}
          bg={'white'}
          boxShadow={'lg'}
          borderRadius={'0.5rem'}
          p={'2rem 2rem 1rem 2rem'}
        >
          <Formik
            initialValues={{
              name: '',
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
              alert(JSON.stringify(values, null, 2));
            }}
          >
            {({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <Grid
                  gridTemplateAreas={`"name lastName" "email email" "password passwordConfirm" "phone address" "department location" "submit submit"`}
                  gap={'1rem'}
                >
                  <GridItem gridArea={'name'}>
                    <FormControl width={'20rem'}>
                      <FormLabel htmlFor="name">Nombre</FormLabel>
                      <Field
                        as={Input}
                        id="name"
                        name="name"
                        type="text"
                        variant="filled"
                        _focus={{ borderColor: 'primary.main' }}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem gridArea={'lastName'}>
                    <FormControl width={'20rem'}>
                      <FormLabel htmlFor="lastName">Apellido</FormLabel>
                      <Field
                        as={Input}
                        id="lastName"
                        name="lastName"
                        type="text"
                        variant="filled"
                        _focus={{ borderColor: 'primary.main' }}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem gridArea={'email'}>
                    <FormControl>
                      <FormLabel htmlFor="email">Correo electrónico</FormLabel>
                      <Field
                        as={Input}
                        id="email"
                        name="email"
                        type="email"
                        variant="filled"
                        _focus={{ borderColor: 'primary.main' }}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem gridArea={'password'}>
                    <FormControl width={'20rem'}>
                      <FormLabel htmlFor="password">Contraseña</FormLabel>
                      <Field
                        as={Input}
                        id="password"
                        name="password"
                        type="password"
                        variant="filled"
                        _focus={{ borderColor: 'primary.main' }}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem gridArea={'passwordConfirm'}>
                    <FormControl width={'20rem'}>
                      <FormLabel htmlFor="passwordConfirm">Confirme su contraseña</FormLabel>
                      <Field
                        as={Input}
                        id="passwordConfirm"
                        name="passwordConfirm"
                        type="password"
                        variant="filled"
                        _focus={{ borderColor: 'primary.main' }}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem gridArea={'phone'}>
                    <FormControl width={'20rem'}>
                      <FormLabel htmlFor="phone">Teléfono</FormLabel>
                      <Field
                        as={Input}
                        id="phone"
                        name="phone"
                        type="tel"
                        variant="filled"
                        _focus={{ borderColor: 'primary.main' }}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem gridArea={'address'}>
                    <FormControl width={'20rem'}>
                      <FormLabel htmlFor="address">Direccion</FormLabel>
                      <Field
                        as={Input}
                        id="address"
                        name="address"
                        type="text"
                        variant="filled"
                        _focus={{ borderColor: 'primary.main' }}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem gridArea={'department'}>
                    <FormControl width={'20rem'}>
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
                      >
                        <option value="-1">Seleccione un departamento...</option>
                        {statesSelect()}
                      </Field>
                    </FormControl>
                  </GridItem>
                  <GridItem gridArea={'location'}>
                    <FormControl width={'20rem'}>
                      <FormLabel htmlFor="location">Localidad</FormLabel>
                      <Field
                        as={Select}
                        id="location"
                        name="location"
                        type="text"
                        variant="filled"
                        isDisabled={cities.isLoading}
                        _focus={{ borderColor: 'primary.main' }}
                      >
                        <option value="-1">Seleccione una localidad...</option>
                        {citiesSelect(selectedState)}
                      </Field>
                    </FormControl>
                  </GridItem>

                  <GridItem gridArea={'submit'} mt={'1rem'}>
                    <Button
                      type="submit"
                      bg={_loginButtonBg}
                      color={'white'}
                      width="100%"
                      _hover={{ backgroundColor: 'primary.main' }}
                      mb={'0.75rem'}
                    >
                      Registrarse
                    </Button>
                  </GridItem>
                </Grid>
              </form>
            )}
          </Formik>
        </Container>
      </Box>
    </Box>
  );
};
