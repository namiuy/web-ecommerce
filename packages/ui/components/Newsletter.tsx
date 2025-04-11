import { Stack, Input, IconButton, Heading, useToast } from '@chakra-ui/react';
import { useState } from 'react';
import { BiMailSend } from 'react-icons/bi';
import { newsletterSubscribe, validateEmail } from 'shared';

const _placeholderColor = 'brand.footer.color';
const _backgroundColor = 'brand.footer.input.backgroundColor';
const _inputColor = 'brand.footer.input.color';
const _buttonColor = 'brand.footer.iconButton.color';
const _focusBorderColor = 'brand.footer.input.borderColor';
const _buttonBackgroundColor = 'brand.footer.iconButton._active.backgroundColor';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const toast = useToast();

  const add = () => {
    if (validateEmail(email)) {
      toast({
        position: 'top',
        description: 'Debe ingresar un correo electrónico válido',
        status: 'error',
        duration: 3000,
      });
      return;
    }
    setIsLoading(true);
    newsletterSubscribe({
      email,
    })
      .then(() => {
        setIsSuccess(true);
        toast({
          position: 'top',
          description: 'Se ha suscrito exitosamente',
          status: 'success',
          duration: 3000,
        });
      })
      .catch(error => {
        console.log(error);
        toast({
          position: 'top',
          description: 'Ha ocurrido un error, intentelo mas tarde',
          status: 'error',
          duration: 3000,
        });
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <Stack>
      <Stack spacing={3}>
        <Heading size="md">Suscribirse a noticias</Heading>
        <Stack direction={'row'}>
          <Input
            w={{ base: '100%', sm: '75%', md: '100%' }}
            placeholder={'Correo electrónico'}
            disabled={isLoading}
            value={email}
            onChange={e => setEmail(e.target.value)}
            _placeholder={{ color: _placeholderColor }}
            _focus={{ borderColor: _focusBorderColor, boxShadow: 'unset' }}
            bg={_backgroundColor}
            border={0}
            color={_inputColor}
          />
          <IconButton
            bg={_backgroundColor}
            color={_buttonColor}
            _hover={{
              bg: _backgroundColor,
            }}
            _active={{
              bg: _buttonBackgroundColor,
            }}
            aria-label="Subscribe"
            disabled={isLoading}
            icon={<BiMailSend />}
            onClick={add}
          />
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Newsletter;
