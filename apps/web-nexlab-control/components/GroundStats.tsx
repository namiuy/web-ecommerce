'use client';

import { Flex } from '@chakra-ui/react';
import { StatsCard } from './StatsCard';
import { FaThermometerHalf, FaTint, FaBolt, FaFlask } from 'react-icons/fa';

const groundValues = [
  { name: 'Temperatura', key: 'temperature', unit: '°C', icon: FaThermometerHalf },
  { name: 'Humedad', key: 'humidity', unit: '%', icon: FaTint },
  { name: 'Conductividad (EC)', key: 'ec', unit: 'mS/cm', icon: FaBolt },
  { name: 'pH', key: 'ph', unit: '', icon: FaFlask },
];

type GroundStatsProps = {
  values: Record<string, number>;
  historical: Record<string, number[]>; // nuevo
};

export const GroundStats = ({ values, historical }: GroundStatsProps) => {
  return (
    <Flex gap="1rem" wrap="nowrap" overflow="scroll" justify={{ base: 'space-between', md: 'flex-start' }}>
      {groundValues.map(({ key, name, unit, icon }) => (
        <StatsCard key={key} title={name} value={values[key] ?? 0} unit={unit} icon={icon} data={historical[key] ?? []} />
      ))}
    </Flex>
  );
};
