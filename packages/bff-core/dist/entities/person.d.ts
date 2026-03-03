import { Address } from './address';
import { Phone } from './phone';
export type Person = {
    id: string;
    name: string;
    last_name: string;
    email: string;
    default_phone: string;
    default_address: string;
    phones: Phone[];
    addresses: Address[];
    error?: string;
};
//# sourceMappingURL=person.d.ts.map