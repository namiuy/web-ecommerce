import { Box, HStack, Tooltip, Text } from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';
import { getColors } from 'shared';

type ColorSelectorProps = {
  colors?: string[];
  selectedColor?: string;
  onSelect?: (color: string) => void;
  onToggleColor?: (colorId: string) => void;
  isEdit?: boolean;
  isSelect?: boolean;
};

export const ColorSelector = ({
  colors = [],
  selectedColor,
  onSelect,
  onToggleColor,
  isEdit = false,
  isSelect = false,
}: ColorSelectorProps) => {
  const availableColors = getColors();
  const displayedColors = isEdit ? availableColors : availableColors.filter(({ id }) => colors.includes(id));

  return (
    <Box>
      {(isEdit || isSelect) && (
        <Text fontWeight="medium" fontSize="0.875rem" mb="0.5rem">
          {isEdit ? 'Colores disponibles' : 'Selecciona un color'}
        </Text>
      )}
      <HStack spacing="0.75rem" m={isEdit ? '0' : '1rem 0'} flexWrap="wrap">
        {displayedColors.map(({ id, color, name }) => {
          const isEnabled = colors.includes(id);
          const isSelected = selectedColor === id;

          return (
            <Tooltip key={id} label={name}>
              <Box
                position="relative"
                display="flex"
                alignItems="center"
                justifyContent="center"
                width="2.5rem"
                height="2.5rem"
                borderRadius="50%"
                border="2px solid"
                borderColor={isEdit ? (isEnabled ? 'green.500' : 'lightgrey') : isSelected ? 'green.500' : 'lightgrey'}
                cursor={isEdit || isSelect ? 'pointer' : 'default'}
                onClick={() => {
                  if (isEdit) {
                    onToggleColor?.(id);
                  } else if (isSelect && isEnabled) {
                    onSelect?.(id);
                  }
                }}
                opacity={isEnabled || isEdit ? 1 : 0.4}
              >
                <Box w="2rem" h="2rem" borderRadius="50%" bg={color} />
                {(isSelected || (isEdit && isEnabled)) && (
                  <Box
                    position="absolute"
                    top="-0.25rem"
                    right="-0.25rem"
                    width="1rem"
                    height="1rem"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    bg="green.500"
                    borderRadius="50%"
                  >
                    <CheckIcon color="white" boxSize="0.6rem" />
                  </Box>
                )}
              </Box>
            </Tooltip>
          );
        })}
      </HStack>
    </Box>
  );
};
