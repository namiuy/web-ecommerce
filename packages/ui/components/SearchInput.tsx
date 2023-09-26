import { useRouter } from 'next/router';
import { Input, InputGroup, InputLeftElement, Icon, InputRightElement, Button } from '@chakra-ui/react';
import { AiOutlineSearch } from 'react-icons/ai';
import { KeyboardEvent, ChangeEvent, useState } from 'react';

const _color = 'brand.navBar.input.color';
const _borderColor = 'brand.navBar.input.borderColor';
const _backgroundColor = 'brand.navBar.input.backgroundColor';
const _placeholderColor = 'brand.navBar.input._placeholder.color';
const _focusBorderColor = 'brand.navBar.input._focus.borderColor';

type SearchInputProps = {
  placeholder?: string;
  onSearch?: () => void;
};

const productsPath = '/productos';

const SearchInput = ({ placeholder = 'Buscar un producto', onSearch }: SearchInputProps) => {
  const router = useRouter();
  const isProductsPath = router.pathname === productsPath;
  const { t } = router.query;
  const [value, setValue] = useState(isProductsPath && t ? t : '');

  const search = () => {
    if (value.length > 2) {
      router.push(`${productsPath}?t=${value}`);
      if (onSearch) onSearch();
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => setValue(event.target.value);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') search();
  };

  return (
    <InputGroup>
      <InputLeftElement w="3rem" h="3rem">
        <Icon w="1.25rem" h="1.25rem" as={AiOutlineSearch} color={_borderColor} />
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
        onKeyDown={handleKeyDown}
      />
      <InputRightElement w="auto" h="100%">
        <Button
          h="1.25rem"
          variant="ghost"
          color={_borderColor}
          borderLeftWidth="1px"
          borderColor={_borderColor}
          fontWeight="400"
          borderRadius="0"
          fontSize="0.875rem"
          onClick={search}
          _focus={{ bg: 'transparent', color: _focusBorderColor }}
          _hover={{ bg: 'transparent', color: _focusBorderColor }}
        >
          Buscar
        </Button>
      </InputRightElement>
    </InputGroup>
  );
};

export default SearchInput;
