import { Icon, Link } from '@chakra-ui/react';
import { Button, Skeleton } from 'ui';
import { FC } from 'react';
import { ProductActionProps } from '../templates/ProductDetail';
import { BiLogoWhatsapp } from 'react-icons/bi';
import { siteHost } from 'shared';

export const WhatsAppRequestButton: FC<ProductActionProps> = ({ isLoading, product }) => (
  <Skeleton isLoaded={!isLoading}>
    <Button
      as={Link}
      href={`https://wa.me/598091033282/?text=Hola,%20estoy%20interesado%20en%20el%20siguiente%20producto:%20${siteHost}${product?.path}`}
      target="_blank"
      width="100%"
      height={'2.75rem'}
      borderRadius="0.5rem"
      bg="#00ea81"
      color="white"
      _hover={{ backgroundColor: '#25D366', textDecoration: 'none' }}
    >
      CONSULTAR POR WHATSAPP <Icon as={BiLogoWhatsapp} ml="5px" boxSize="6" mb="3px" />
    </Button>
  </Skeleton>
);
