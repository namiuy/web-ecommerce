'use client';

import { Box, Heading, VStack } from '@chakra-ui/react';
import { STAT_GROUPS } from '../data/sectorStats';
import { GenericStatsGroup } from './GenericStatsGroup';

type StatsAreaProps = {
  stats: Partial<
    Record<
      string,
      {
        values: Record<string, number>;
        historical: Record<string, number[]>;
      }
    >
  >;
};

export const StatsArea = ({ stats }: StatsAreaProps) => {
  return (
    <VStack spacing="2rem" align="stretch">
      {Object.entries(stats).map(([groupName, data]) =>
        data ? (
          <Box key={groupName}>
            <Heading size="sm" mb="0.75rem" color="blackAlpha.500">
              {groupName.toUpperCase()}
            </Heading>
            <GenericStatsGroup group={STAT_GROUPS[groupName as keyof typeof STAT_GROUPS]} values={data.values} historical={data.historical} />
          </Box>
        ) : null,
      )}
    </VStack>
  );
};
