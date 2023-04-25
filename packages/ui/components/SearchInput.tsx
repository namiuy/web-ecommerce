import { useRouter } from 'next/router';
import { Input, InputGroup, InputLeftElement, Icon } from '@chakra-ui/react';
import { AiOutlineSearch } from 'react-icons/ai';
import { KeyboardEvent, ChangeEvent, useState } from 'react';

const _color = 'brand.navBar.input.color';
const _borderColor = 'brand.navBar.input.borderColor';
const _iconColor = 'brand.navBar.input.iconColor';
const _backgroundColor = 'brand.navBar.input.backgroundColor';
const _placeholderColor = 'brand.navBar.input._placeholder.color';
const _focusBorderColor = 'brand.navBar.input._focus.borderColor';
type SearchInputProps = { placeholder?: string };

const productsPath = '/productos';

const SearchInput = ({ placeholder = 'Buscar un producto' }: SearchInputProps) => {
  const router = useRouter();
  const isProductsPath = router.pathname === productsPath;
  const { t } = router.query;
  const [value, setValue] = useState(isProductsPath && t ? t : '');
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => setValue(event.target.value);
  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && value.length > 2) router.push(`${productsPath}?t=${value}`);
  };
  return (
    <InputGroup>
      <InputLeftElement w="3rem" h="3rem">
        <Icon w="1.25rem" h="1.25rem" as={AiOutlineSearch} color={_iconColor} />
      </InputLeftElement>
      <Input
        h="3rem"
        pl="2.875rem"
        pr="1rem"
        borderRadius="3rem"
        border="solid 1px"
        borderColor={_borderColor}
        color={_color}
        backgroundColor={_backgroundColor}
        fontSize="0.813rem"
        placeholder={placeholder}
        _placeholder={{ color: _placeholderColor }}
        _focus={{ borderColor: _focusBorderColor, boxShadow: 'unset' }}
        _hover={{ borderColor: _focusBorderColor }}
        value={value}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
      />
    </InputGroup>
  );
};

export default SearchInput;
