import { Logo as logoCredi } from './Logo/LogoCredi';
import { Logo as logoNami } from './Logo/LogoNami';
import { envId } from 'shared';

export const Logo = envId === 'CREDI' ? logoCredi : logoNami;
