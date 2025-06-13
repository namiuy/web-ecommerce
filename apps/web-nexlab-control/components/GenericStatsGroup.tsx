'use client';

import { Flex } from '@chakra-ui/react';
import { StatsCard } from './StatsCard';

type StatMeta = {
  name: string;
  key: string;
  unit: string;
  icon: any;
};

type Props = {
  group: StatMeta[];
  values: Record<string, number>;
  historical: Record<string, number[]>;
};

export const GenericStatsGroup = ({ group, values, historical }: Props) => (
  <Flex gap="1rem" wrap="nowrap" overflowX="auto">
    {group.map(({ name, key, unit, icon }) => (
      <StatsCard key={key} title={name} value={values?.[key] ?? 0} unit={unit} icon={icon} data={historical?.[key] ?? []} />
    ))}
  </Flex>
);
