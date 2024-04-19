import { useRouter } from 'next/router';
import { Input, InputGroup, InputLeftElement, Icon, InputRightElement, Button } from '@chakra-ui/react';
import { AiOutlineSearch } from 'react-icons/ai';
import { KeyboardEvent, ChangeEvent, useState, useEffect } from 'react';

const _color = 'brand.navBar.input.color';
const _iconColor = 'brand.navBar.input.iconColor';
const _borderColor = 'brand.navBar.input.borderColor';
const _backgroundColor = 'brand.navBar.input.backgroundColor';
const _placeholderColor = 'brand.navBar.input._placeholder.color';
const _hoverBorderColor = 'brand.navBar.input._hover.borderColor';
const _focusBorderColor = 'brand.navBar.input._focus.borderColor';

type SearchInputProps = {
  placeholder?: string;
  onSearch?: () => void;
};

const productsPath = '/productos';

const SearchInput = ({ placeholder = 'Buscar un producto...', onSearch }: SearchInputProps) => {
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

  useEffect(() => {
    if (!router.query?.t) {
      setValue('');
    }
  }, [router.query]);

  return (
    <InputGroup>
      <Input
        h="3rem"
        borderRadius="3rem"
        border="solid 1px"
        borderColor={_borderColor}
        color={_color}
        backgroundColor={_backgroundColor}
        fontSize="0.938rem"
        placeholder={placeholder}
        _placeholder={{ color: _placeholderColor }}
        _focus={{ borderColor: _focusBorderColor, boxShadow: 'unset' }}
        _hover={{ borderColor: _hoverBorderColor }}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <InputRightElement w="auto" h="100%" onClick={search} cursor="pointer">
        <Icon w="1.5rem" h="1.5rem" mr="1rem" as={AiOutlineSearch} color={_iconColor} />
      </InputRightElement>
    </InputGroup>
  );
};

export default SearchInput;
