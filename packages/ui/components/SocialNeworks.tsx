import { Flex, Icon as ChakraIcon } from '@chakra-ui/react';
import Link from 'next/link';
import { IconType } from 'react-icons';
import { AiFillInstagram } from 'react-icons/ai';
import { IoLogoTiktok, IoLogoWhatsapp } from 'react-icons/io5';
import { MdFacebook } from 'react-icons/md';
import { socialNeworksItems } from 'shared/env';
import { AnimationWrapper } from './AnimationWrapper';

type Icon = {
  icon: IconType;
  hoverColor: string;
  hoverColorDark?: string;
};

const icons: Record<string, Icon> = {
  facebook: { icon: MdFacebook, hoverColor: '#4167b1' },
  instagram: { icon: AiFillInstagram, hoverColor: '#ed1d67' },
  tiktok: { icon: IoLogoTiktok, hoverColor: '#111111', hoverColorDark: 'white' },
  whatsapp: { icon: IoLogoWhatsapp, hoverColor: '#00ea81' },
  // youtube #c4302b
  // twitter #33b3e6
};

type SocialNeworksProps = {
  dark?: boolean;
  color?: string;
  size?: string;
  gap?: string;
  hide?: string[];
};

const SocialNeworks = ({
  dark = false,
  color = 'black',
  size = '1rem',
  gap = '1rem',
  hide = [],
}: SocialNeworksProps) => (
  <nav>
    <Flex as="ol" alignItems="center" listStyleType="none" gap={gap}>
      {socialNeworksItems
        .filter(({ id }) => !hide.includes(id))
        .map(({ id, href }) => (
          <li key={id}>
            <Link href={href} target="_blank">
              <ChakraIcon
                as={icons[id].icon}
                w={size}
                h={size}
                display="block"
                color={color}
                _hover={{ color: dark ? icons[id].hoverColorDark || icons[id].hoverColor : icons[id].hoverColor }}
              />
            </Link>
          </li>
        ))}
    </Flex>
  </nav>
);

export default SocialNeworks;
