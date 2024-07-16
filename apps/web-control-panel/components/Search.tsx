import { Icon, Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { ChangeEvent, KeyboardEvent, useState } from 'react';
import { addSearchParamsToUrl, getProductsUrl } from 'shared';

import { AiOutlineSearch } from 'react-icons/ai';

type SearchProps = {
  initialValue?: string;
};

export const Search = ({ initialValue = '' }: SearchProps) => {
  const router = useRouter();
  const [text, setText] = useState<string>(initialValue);

  const validateAndSearch = (text: string) => {
    if (text.length === 0 || text.length > 2) {
      const href = addSearchParamsToUrl(getProductsUrl(), { ...router.query, t: text });
      router.push(href);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      validateAndSearch(text);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  return (
    <InputGroup w="15rem">
      <Input placeholder="Buscar un producto..." defaultValue={text} onKeyDown={handleKeyDown} onChange={handleChange} />
      <InputRightElement>
        <Icon
          boxSize="6"
          as={AiOutlineSearch}
          color={'grey'}
          onClick={() => validateAndSearch(text)}
          cursor="pointer"
        />
      </InputRightElement>
    </InputGroup>
  );
};
