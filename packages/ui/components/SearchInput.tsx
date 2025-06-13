import { useRouter } from 'next/router';
import { Input, InputGroup, Icon, InputRightElement, Box } from '@chakra-ui/react';
import { AiOutlineSearch } from 'react-icons/ai';
import { CloseIcon } from '@chakra-ui/icons';
import { KeyboardEvent, ChangeEvent, useState, useEffect } from 'react';

const _color = 'brand.navBar.input.color';
const _iconColor = 'brand.navBar.input.iconColor';
const _borderColor = 'brand.navBar.input.borderColor';
const _backgroundColor = 'brand.navBar.input.backgroundColor';
const _placeholderColor = 'brand.navBar.input._placeholder.color';
const _hoverBorderColor = 'brand.navBar.input._hover.borderColor';

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
    if (value.length === 0 || value.length > 2) {
      router.push(`${productsPath}?t=${value}`);
      if (onSearch) onSearch();
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => setValue(event.target.value);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') search();
  };

  const clearInput = () => {
    setValue('');
    router.push(productsPath); // elimina el query param ?t=...
  };

  useEffect(() => {
    if (!router.query?.t) {
      setValue('');
    }
  }, [router.query]);

  return (
    <Box opacity="70%" _hover={{ borderColor: _hoverBorderColor, opacity: '100%' }} transition="250ms">
      <InputGroup>
        <Input
          h="3rem"
          borderRadius="0.5rem"
          border="solid 2px"
          borderColor={_borderColor}
          color={_color}
          backgroundColor={_backgroundColor}
          fontSize="0.938rem"
          fontWeight="medium"
          placeholder={placeholder}
          _placeholder={{ color: _placeholderColor }}
          _focus={{ borderColor: 'white', opacity: '100%', boxShadow: 'unset' }}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <InputRightElement w="auto" h="100%">
          <Box display="flex" alignItems="center" h="100%">
            {value && (
              <Icon
                as={CloseIcon}
                w="1rem"
                h="1rem"
                color={_iconColor}
                mx="0.5rem"
                cursor="pointer"
                onClick={clearInput}
              />
            )}
            <Icon
              as={AiOutlineSearch}
              w="1.5rem"
              h="1.5rem"
              mx="0.75rem"
              color={_iconColor}
              cursor="pointer"
              onClick={search}
            />
          </Box>
        </InputRightElement>
      </InputGroup>
    </Box>
  );
};

export default SearchInput;
