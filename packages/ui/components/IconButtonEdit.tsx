import { IconButton, IconButtonProps } from '@chakra-ui/react';
import { FC } from 'react';
import { MdEdit } from 'react-icons/md';

export const IconButtonEdit: FC<IconButtonProps> = porps => (
  <IconButton
    {...porps}
    w="2rem"
    h="2rem"
    minW="none"
    aria-label=""
    bg="none"
    color="grey"
    icon={<MdEdit />}
    borderRadius="2rem"
    _hover={{ bg: 'white', color: 'black' }}
  />
);
