import { Box, Text } from '@chakra-ui/react';

export const ResultsFor = ({ text }: { text?: string }) =>
  !text ? (
    <></>
  ) : (
    <Box pt={{ lg: '1.5rem' }}>
      <Text as="span" fontSize="1.25rem" fontWeight="medium" color="black">{`'${text}'`}</Text>
    </Box>
  );
