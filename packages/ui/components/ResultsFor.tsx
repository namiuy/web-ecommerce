import { Box, Text } from '@chakra-ui/react';

export const ResultsFor = ({ text }: { text?: string }) =>
  !text ? (
    <></>
  ) : (
    <Box p="2rem">
      <Text as="span" fontSize="1.25rem" fontWeight="medium" color="brand.grey.2">
        Resultados para
      </Text>{' '}
      <Text as="span" fontSize="1.25rem" fontWeight="medium" color="black">{`'${text}'`}</Text>
    </Box>
  );
