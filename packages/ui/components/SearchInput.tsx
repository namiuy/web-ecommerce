import { Input, InputGroup, InputLeftElement, Icon } from '@chakra-ui/react';
import { AiOutlineSearch } from 'react-icons/ai';

const _borderColor = 'brand.input.borderColor';
const _placeholderColor = 'brand.input._placeholder.color';
const _focusBorderColor = 'brand.input._focus.borderColor';

type SearchInputProps = { placeholder?: string; borderColor?: string; iconColor?: string };

const SearchInput = ({
  placeholder = 'Buscar un producto',
  borderColor = _borderColor,
  iconColor = borderColor,
}: SearchInputProps) => (
  <InputGroup>
    <InputLeftElement w="3rem" h="3rem">
      <Icon w="1.25rem" h="1.25rem" as={AiOutlineSearch} color={iconColor} />
    </InputLeftElement>
    <Input
      h="3rem"
      pl="2.875rem"
      pr="1rem"
      borderRadius="3rem"
      border="solid 1px"
      borderColor={borderColor}
      fontSize="0.813rem"
      placeholder={placeholder}
      _placeholder={{ color: _placeholderColor }}
      _focus={{ borderColor: _focusBorderColor, boxShadow: 'unset' }}
    />
  </InputGroup>
);

export default SearchInput;
