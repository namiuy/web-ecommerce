import { Box, Text, Spinner } from '@chakra-ui/react';
import { useState, useEffect } from 'react';

type AutopartStockProps = {
  code: string;
};

export const AutopartStock = ({ code }: AutopartStockProps) => {
  const [stock, setStock] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!code) return;
    fetch(`/api/stocks/${encodeURIComponent(code.trim())}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => setStock(data))
      .catch(() => setStock(null))
      .finally(() => setLoading(false));
  }, [code]);

  if (loading) return <Spinner size="sm" />;
  if (!stock) return <Text fontSize="sm" color="gray.500">Sin datos de stock</Text>;

  const total = stock.total || stock.stock || 0;
  return (
    <Box>
      <Text fontSize="sm" fontWeight="bold" color={total > 0 ? 'green.600' : 'red.500'}>
        Stock: {total}
      </Text>
    </Box>
  );
};
