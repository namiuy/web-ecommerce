'use client';

import { Box, Grid, Heading } from '@chakra-ui/react';
import { SECTOR_STATS } from '../data/sectorStats';
import { StatsArea } from './StatsArea';
import { Flex } from 'ui';

export const StatsBySector = () => {
  return (
    <Box p="2rem" bg="#f5f5f7" minH="100vh">
      <Heading size="lg" mb="2rem">
        NexLab Control
      </Heading>

      <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap="2rem" autoRows="minmax(22rem, 1fr)">
        {SECTOR_STATS.map(({ name, stats }) => (
          <Box key={name} bg="white" borderRadius="1rem" p="2rem" boxShadow="sm" overflowY="auto" maxH="35rem">
            <Heading size="md" mb="1rem">
              {name}
            </Heading>
            {Object.keys(stats).length > 0 ? (
              <StatsArea stats={stats} />
            ) : (
              <Flex justifyContent="center" alignItems="center" color="gray.400" h="25rem">
                Sin datos disponibles
              </Flex>
            )}
          </Box>
        ))}
      </Grid>
    </Box>
  );
};
