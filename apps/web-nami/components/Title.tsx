import { ReactNode } from 'react';
import { Heading } from 'ui';

const _borderColor = 'brand.productDetail.borderColor';

export const Title = ({ children }: { children: ReactNode }) => (
  <Heading pb="0.5rem" mb="1rem" borderBottom="1px" borderColor={_borderColor} size="lg">
    {children}
  </Heading>
);
