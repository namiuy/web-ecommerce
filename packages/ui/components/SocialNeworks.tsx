import { Flex, Icon as ChakraIcon } from '@chakra-ui/react';
import Link from 'next/link';
import { IconType } from 'react-icons';
import { AiFillInstagram } from 'react-icons/ai';
import { IoLogoTiktok, IoLogoWhatsapp } from 'react-icons/io5';
import { MdFacebook } from 'react-icons/md';

export type SocialNeworkItem = {
  id: string;
  href: string;
};

type Icon = {
  icon: IconType;
  hoverColor: string;
};

const icons: Record<string, Icon> = {
  facebook: { icon: MdFacebook, hoverColor: '#4167b1' },
  instagram: { icon: AiFillInstagram, hoverColor: '#ed1d67' },
  tiktok: { icon: IoLogoTiktok, hoverColor: '#111111' },
  whatsapp: { icon: IoLogoWhatsapp, hoverColor: '#00ea81' },
  // youtube #c4302b
  // twitter #33b3e6
};

type SocialNeworksProps = {
  color?: string;
  items: SocialNeworkItem[];
};

const SocialNeworks = ({ color = 'black', items = [] }: SocialNeworksProps) => (
  <nav>
    <Flex as="ol" alignItems="center" listStyleType="none" gap="1rem">
      {items.map(({ id, href }) => (
        <li key={id}>
          <Link href={href}>
            <ChakraIcon
              as={icons[id].icon}
              w="1rem"
              h="1rem"
              display="block"
              color={color}
              _hover={{ color: icons[id].hoverColor }}
            />
          </Link>
        </li>
      ))}
    </Flex>
  </nav>
);

export default SocialNeworks;
