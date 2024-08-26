import { ReactNode } from 'react';
import { Text } from '@chakra-ui/react';

type ParagraphProps = {
  children: ReactNode;
  pb: string;
};

export const Paragraph = ({ children, pb }: ParagraphProps) => (
  <Text pb={pb} textAlign="justify">
    {children}
  </Text>
);
