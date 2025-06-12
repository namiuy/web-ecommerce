'use client';

import { Flex } from '@chakra-ui/react';
import { StatsCard } from './StatsCard';
import { FaLeaf } from 'react-icons/fa';

const npkValues = [
  { name: 'Nitrógeno (N)', key: 'n', unit: 'mg/kg', icon: FaLeaf },
  { name: 'Fósforo (P)', key: 'p', unit: 'mg/kg', icon: FaLeaf },
  { name: 'Potasio (K)', key: 'k', unit: 'mg/kg', icon: FaLeaf },
];

type NpkStatsProps = {
  values: Record<string, number>;
  historical: Record<string, number[]>; // nuevo
};

export const NpkStats = ({ values, historical }: NpkStatsProps) => {
  return (
    <Flex gap="1rem" wrap="nowrap" overflow="scroll" justify={{ base: 'space-between', md: 'flex-start' }}>
      {npkValues.map(({ key, name, unit, icon }) => (
        <StatsCard key={key} title={name} value={values[key] ?? 0} unit={unit} icon={icon} data={historical[key] ?? []} />
      ))}
    </Flex>
  );
};
