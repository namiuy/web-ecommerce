import { Flex, Icon as ChakraIcon } from '@chakra-ui/react';
import Link from 'next/link';
import { IconType } from 'react-icons';
import { AiFillInstagram } from 'react-icons/ai';
import { IoLogoTiktok, IoLogoWhatsapp } from 'react-icons/io5';
import { MdFacebook } from 'react-icons/md';
import { FaYoutube, FaLinkedin } from 'react-icons/fa';
import { socialNeworksItems } from 'shared/env';
import { AnimationWrapper } from './AnimationWrapper';
import { BiBorderRadius } from 'react-icons/bi';

const _backgroundColor = 'brand.footer.backgroundColor';

type Icon = {
  icon: IconType;
  hoverColor: string;
  hoverColorDark?: string;
};

const icons: Record<string, Icon> = {
  facebook: { icon: MdFacebook, hoverColor: '#4167b1' },
  instagram: { icon: AiFillInstagram, hoverColor: '#ed1d67' },
  tiktok: { icon: IoLogoTiktok, hoverColor: '#111111' },
  whatsapp: { icon: IoLogoWhatsapp, hoverColor: '#25D366' },
  youtube: { icon: FaYoutube, hoverColor: '#c4302b' },
  linkedin: { icon: FaLinkedin, hoverColor: '#0a66c2' },
};

type SocialNetworksProps = {
  bg?: string;
  dark?: boolean;
  color?: string;
  size?: string;
  padding?: string;
  gap?: string;
  borderRadius?: string;
  hide?: string[];
  hover?: boolean;
};

const SocialNetworks = ({
  dark = false,
  color = 'black',
  size = '1rem',
  gap = '1rem',
  hide = [],
  hover = false,
}: SocialNetworksProps) => (
  <nav>
    <Flex as="ol" justifyContent="flex-start" alignItems="center" listStyleType="none" gap={gap}>
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
                _hover={
                  hover
                    ? { color: dark ? icons[id].hoverColorDark || icons[id].hoverColor : icons[id].hoverColor }
                    : undefined
                }
              />
            </Link>
          </li>
        ))}
    </Flex>
  </nav>
);

export default SocialNetworks;
