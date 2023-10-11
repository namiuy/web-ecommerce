import { Stack, Input, IconButton, Heading, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { BiMailSend } from 'react-icons/bi';
import { newsletterSubscribe, validateEmail } from 'shared';
const _placeholderColor = 'brand.navBar.input._placeholder.color';
const _focusBorderColor = 'brand.navBar.input._focus.borderColor';

export const Newsletter = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMesssage] = useState('');
  const [email, setEmail] = useState('');

  const add = () => {
    if (validateEmail(email)) {
      setMesssage('Ingrese un email valido');
      return;
    }
    setIsLoading(true);
    newsletterSubscribe({
      email,
    })
      .then(() => {
        setIsSuccess(true);
        setMesssage('Se ha suscrito correctamente');
      })
      .catch(error => {
        console.log(error);
        setMesssage('Ha ocurrido un error, intentelo mas tarde');
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <Stack>
      <Stack spacing={4}>
        <Heading size="md">Suscribirse a noticias</Heading>
        <Stack direction={'row'}>
          <Input
            w={{ base: '100%', sm: '75%', md: '100%' }}
            placeholder={'Correo electrónico'}
            disabled={isLoading || isSuccess}
            value={email}
            onChange={e => setEmail(e.target.value)}
            _placeholder={{ color: _placeholderColor }}
            _focus={{ borderColor: _focusBorderColor, boxShadow: 'unset' }}
            _hover={{ borderColor: _focusBorderColor }}
            bg="blackAlpha.300"
            border={0}
          />
          <IconButton
            bg="red.800"
            color="white"
            _hover={{
              bg: 'red.700',
            }}
            aria-label="Subscribe"
            disabled={isLoading || isSuccess}
            icon={<BiMailSend />}
            onClick={add}
          />
        </Stack>
      </Stack>
      <Text color="white" fontSize={'sm'}>
        {message}
      </Text>
    </Stack>
  );
};
