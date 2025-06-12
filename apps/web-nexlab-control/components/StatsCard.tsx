'use client';

import { Box, Text, Flex } from '@chakra-ui/react';
import { IconType } from 'react-icons';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip);

type StatCardProps = {
  icon: IconType;
  title: string;
  value: number | string;
  unit: string;
  data: number[];
};

export const StatsCard = ({ icon: Icon, title, value, unit, data }: StatCardProps) => {
  const chartData = {
    labels: data.map((_, i) => i),
    datasets: [
      {
        data,
        fill: false,
        borderColor: '#319795',
        tension: 0.3,
        pointRadius: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { display: false },
      y: { display: false },
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
  };

  return (
    <Box
      bg="#f5f5f7"
      borderRadius="1rem"
      boxShadow="sm"
      p="0.75rem"
      textAlign="center"
      minW={{ base: '45%', md: '10rem' }}
      maxW="10rem"
      flex="1 1 auto"
      aspectRatio={1}
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Flex direction="column" justifyContent="center" align="center" gap="0.25rem" flex="1">
        <Icon size="1.5rem" color="#319795" />
        <Text fontSize="sm" fontWeight="medium">
          {title}
        </Text>
        <Flex align="baseline" gap="0.25rem">
          <Text fontSize="2xl" fontWeight="bold" lineHeight="1.2">
            {value}
          </Text>
          <Text fontSize="xs" color="gray.500">
            {unit}
          </Text>
        </Flex>
      </Flex>
      <Box w="100%" h="2rem" mt="0.25rem">
        <Line data={chartData} options={chartOptions} />
      </Box>
    </Box>
  );
};
