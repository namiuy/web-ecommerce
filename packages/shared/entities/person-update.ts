import { Param } from './param';
import { Address } from './address';
import { Phone } from './phone';

export type PersonUpdate = {
  id: string;
  phones: Phone[];
  addresses: Address[];
  params: Param[];
  update_user?: boolean;
  guid?: string;
  error?: string;
};
