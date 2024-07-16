import { Logo as logoCredi } from '../../web-credibikerss/components/Logo';
import { Logo as logoNami } from '../../web-nami/components/Logo';

import { envId } from 'shared';

export const Logo = envId === 'CREDI' ? logoCredi : logoNami;
