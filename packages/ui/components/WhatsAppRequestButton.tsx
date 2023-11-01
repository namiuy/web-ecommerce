import { Icon, Link, Skeleton } from '@chakra-ui/react';
import { Button } from 'ui';
import { FC } from 'react';
import { ProductActionProps } from '../templates/ProductDetail';
import { BiLogoWhatsapp } from 'react-icons/bi';

export const WhatsAppRequestButton: FC<ProductActionProps> = ({ isLoading, product }) =>
  isLoading ? (
    <Skeleton w="100%" h="2.5rem" />
  ) : (
    <>
      <Button
        as={Link}
        href={`https://wa.me/598091033282/?text=Buenas,%20estoy%20interesado%20en%20el%20siguiente%20producto:%20${product?.name}`}
        target="_blank"
        width="100%"
        bg="#00ea81"
        color="white"
        my="1rem"
        _hover={{ backgroundColor: '#25D366' }}
        style={{ textDecoration: 'none' }}
      >
        CONSULTAR POR WHATSAPP <Icon as={BiLogoWhatsapp} ml="5px" boxSize="6" mb="3px" />
      </Button>
    </>
  );
