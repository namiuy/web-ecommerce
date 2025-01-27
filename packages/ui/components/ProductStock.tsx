import lscache, { set } from 'lscache';
import { isBrowser, useStockGet } from 'shared';
import { Flex, Text, Tooltip, Spinner, Box } from '@chakra-ui/react';
import { CheckIcon, CloseIcon, PhoneIcon } from '@chakra-ui/icons';
import { useEffect, useState } from 'react';
import { User } from 'shared/entities/user';

const _tooltipBg = 'brand.productDetail.tooltipBg';
const _color = 'brand.productDetail.smallText';

type StockProps = {
  id: string;
  handleStockChange: (stock: string) => void;
};

export const ProductStock = ({ id, handleStockChange }: StockProps) => {
  const issBrowser = isBrowser();
  const [user, setUser] = useState<User>();

  const { isLoading, data } = useStockGet(id);

  useEffect(() => {
    if (data?.availability) {
      handleStockChange(data?.availability);
    }
  }, [data?.availability, handleStockChange]);

  useEffect(() => {
    if (issBrowser) setUser(lscache.get('user')); // TODO: improve this
  }, [issBrowser]);

  const isUserAdmin = user ? user.roles?.includes('seller') : false; // TODO: improve this

  return (
    <Flex alignItems="center" gap="0.5rem">
      <Text color={_color} fontSize="0.875rem">
        Stock
      </Text>
      {isLoading ? (
        <Spinner size="xs" color="blackAlpha.600" />
      ) : (
        <>
          {isUserAdmin ? (
            <Flex gap="0.375rem" pl="0.25rem">
              {data?.branches?.map((branch, i) => (
                <Box
                  key={i}
                  textAlign="center"
                  borderLeft={i != 0 ? '1px solid lightgrey' : 'none'}
                  pl={i != 0 ? '0.375rem' : 0}
                >
                  <Text key={branch.code} color={_color} fontSize="0.75rem" fontWeight="black">
                    {branch.code}
                  </Text>
                  <Text key={branch.code} color={_color} fontSize="0.75rem">
                    {branch.quant}
                  </Text>
                </Box>
              ))}
            </Flex>
          ) : (
            <Text color={_color} fontSize="0.75rem">
              {data?.availability === 'AV' && (
                <Tooltip label="Disponible" bg={_tooltipBg} fontSize="0.75rem" borderRadius="0.25rem">
                  <CheckIcon boxSize="3" mb="3px" />
                </Tooltip>
              )}
              {data?.availability === 'CO' && (
                <Tooltip label="Consulte" bg={_tooltipBg} fontSize="0.75rem" borderRadius="0.25rem">
                  <PhoneIcon boxSize="3" mb="3px" />
                </Tooltip>
              )}
              {data?.availability === 'NO' && (
                <Tooltip label="Agotado" bg={_tooltipBg} fontSize="0.75rem" borderRadius="0.25rem">
                  <CloseIcon boxSize="3" mb="3px" />
                </Tooltip>
              )}
            </Text>
          )}
        </>
      )}
    </Flex>
  );
};
