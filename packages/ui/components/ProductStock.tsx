import { useStockGet } from 'shared';
import { Flex, Text, Tooltip, Spinner } from '@chakra-ui/react';
import { CheckIcon, CloseIcon, PhoneIcon } from '@chakra-ui/icons';

const _tooltipBg = 'brand.productDetail.tooltipBg';
const _color = 'brand.productDetail.smallText';

type StockProps = {
  id: string;
};

export const ProductStock = (props: StockProps) => {
  const { isLoading, error, data } = useStockGet(props.id);
  if (error) {
    console.log(error);
    return <></>;
  }
  return (
    <Flex alignItems="center" gap="0.5rem">
      <Text color={_color} fontSize="0.75rem">
        Stock
      </Text>
      {isLoading ? (
        <Spinner boxSize="3" mb="3px" color={_color} />
      ) : (
        <Text color={_color} fontSize="0.75rem">
          {data?.availablilty === 'AV' && (
            <Tooltip label="Disponible" bg={_tooltipBg} fontSize="0.75rem" borderRadius="0.25rem">
              <CheckIcon boxSize="3" mb="3px" />
            </Tooltip>
          )}
          {data?.availablilty === 'CO' && (
            <Tooltip label="Consulte" bg={_tooltipBg} fontSize="0.75rem" borderRadius="0.25rem">
              <PhoneIcon boxSize="3" mb="3px" />
            </Tooltip>
          )}
          {data?.availablilty === 'NO' && (
            <Tooltip label="Agotado" bg={_tooltipBg} fontSize="0.75rem" borderRadius="0.25rem">
              <CloseIcon boxSize="3" mb="3px" />
            </Tooltip>
          )}
        </Text>
      )}
    </Flex>
  );
};
