import lscache from 'lscache';
import { useDisclosure, Avatar } from '@chakra-ui/react';
import { MdLogout } from 'react-icons/md';
import { User } from 'shared/entities/user';
import { useRouter } from 'next/router';
import { isBrowser } from 'shared';
import { useEffect, useState } from 'react';
import { Flex, Text, Button } from 'ui';

const _avatarBg = 'brand.avatar.backgroundColor';
const _avatarColor = 'brand.avatar.color';

export const UserMenu = () => {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const issBrowser = isBrowser();
  const [user, setUser] = useState<User>();

  useEffect(() => {
    if (issBrowser) setUser(lscache.get('user')); // TODO: improve this
  }, [issBrowser]);

  if (!user) {
    return <></>;
  }

  const { first_name, last_name, roles } = user;
  const isUserAdmin = roles?.includes('admin'); // TODO: improve this
  const userName = `${first_name} ${last_name}`;

  const handleSignOut = () => {
    lscache.remove('user');
    router.push('/iniciar');
  };

  return (
    <Flex flexDir="column" gap="0.875rem">
      <Flex alignItems="center" gap="0.75rem">
        <Avatar w="2rem" h="2rem" size="sm" bg={_avatarBg} color={_avatarColor} name={userName} />
        <Text fontWeight="medium">{userName}</Text>
      </Flex>
      <Button
        leftIcon={<MdLogout />}
        bg="#f2f2f2"
        borderRadius="0.5rem"
        color="black"
        fontWeight="medium"
        fontSize="0.875rem"
        justifyContent="start"
        gap="0.25rem"
        px="0.75rem"
        onClick={handleSignOut}
        _hover={{ color: 'black', bg: '#e0dede' }}
      >
        Cerrar sesión
      </Button>
    </Flex>
  );
};
