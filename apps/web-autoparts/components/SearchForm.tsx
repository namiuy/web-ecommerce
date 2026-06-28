import { useState, FormEvent } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  HStack,
  InputGroup,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react';
import { SearchIcon, CloseIcon } from '@chakra-ui/icons';

interface SearchFormProps {
  onSearch: (query: string, limit: number) => void;
  loading: boolean;
  title?: string;
  subtitle?: string;
  placeholder?: string;
}

export const SearchForm = ({
  onSearch,
  loading,
  title = '¿Qué repuesto buscas?',
  subtitle = 'Búsqueda inteligente por categoria, marca, modelo o descripción',
  placeholder = 'Ej: bomba agua Toyota Corolla, radiador Fiat Uno, filtro aceite motor...'
}: SearchFormProps) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSearch(query.trim(), 50);
  };

  const handleClear = () => {
    setQuery('');
  };

  return (
    <Box w="full">
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <Box textAlign="center">
            <FormLabel
              fontSize={{ base: 'xl', md: '2xl', lg: '3xl' }}
              fontWeight="bold"
              color="gray.900"
              mb={3}
              as="h1"
            >
              {title}
            </FormLabel>
            <FormLabel
              fontSize={{ base: 'sm', md: 'md' }}
              fontWeight="normal"
              color="gray.600"
              mb={6}
              as="p"
            >
              {subtitle}
            </FormLabel>
          </Box>

          <FormControl>
            <Box
              position="relative"
              borderRadius="xl"
              overflow="hidden"
              boxShadow="0 10px 40px -10px rgba(0, 0, 0, 0.1)"
              transition="all 0.3s"
              _hover={{
                boxShadow: '0 20px 60px -10px rgba(0, 0, 0, 0.15)',
              }}
              _focusWithin={{
                boxShadow: '0 20px 60px -10px rgba(66, 153, 225, 0.3), 0 0 0 4px rgba(66, 153, 225, 0.1)',
              }}
            >
              <HStack spacing={0} bg="white">
                <InputGroup size="lg">
                  <Input
                    placeholder={placeholder}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    size="lg"
                    isRequired
                    border="none"
                    borderRadius="xl"
                    borderRightRadius={0}
                    bg="white"
                    py={{ base: 6, md: 7 }}
                    px={{ base: 4, md: 6 }}
                    pr={{ base: query ? 12 : 4, md: query ? 14 : 6 }}
                    fontSize={{ base: 'md', md: 'lg' }}
                    _focus={{
                      outline: 'none',
                      boxShadow: 'none',
                    }}
                    _placeholder={{
                      color: 'gray.400',
                    }}
                  />
                  {query && (
                    <InputRightElement
                      h="full"
                      pr={{ base: 2, md: 3 }}
                    >
                      <IconButton
                        icon={<CloseIcon />}
                        aria-label="Limpiar búsqueda"
                        size="sm"
                        variant="ghost"
                        borderRadius="full"
                        onClick={handleClear}
                        isDisabled={loading}
                        color="gray.500"
                        _hover={{
                          bg: 'gray.100',
                          color: 'gray.700',
                        }}
                      />
                    </InputRightElement>
                  )}
                </InputGroup>
                <Button
                  type="submit"
                  size="lg"
                  colorScheme="blue"
                  isLoading={loading}
                  isDisabled={loading || !query.trim()}
                  borderRadius={0}
                  borderRightRadius="xl"
                  px={{ base: 4, sm: 6 }}
                  py={{ base: 6, md: 7 }}
                  bg="blue.500"
                  aria-label="Buscar"
                  _hover={{
                    bg: 'blue.600',
                  }}
                  _active={{
                    bg: 'blue.700',
                  }}
                  transition="all 0.2s"
                >
                  <SearchIcon boxSize={5} />
                </Button>
              </HStack>
            </Box>
          </FormControl>
        </VStack>
      </form>
    </Box>
  );
};
