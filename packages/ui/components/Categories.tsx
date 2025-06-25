import { SimpleGrid, Image, Text, VStack, Link } from '@chakra-ui/react';
import { Container } from 'ui';
import { homeCategories } from 'shared';

export const Categories = () => {
  return (
    <Container pb="2rem">
      <SimpleGrid columns={{ base: 2, md: 3 }} spacing={{ base: '1rem', md: '3rem' }} mx="auto">
        {homeCategories?.map(cat => (
          <Link href={`/productos?c=${cat.path}`} key={cat.path} _hover={{ textDecoration: 'none' }}>
            <VStack
              bg="#fafafa"
              borderRadius="xl"
              p="2rem"
              boxShadow="sm"
              cursor="pointer"
              transition="all 0.2s"
              _hover={{ boxShadow: 'md' }}
            >
              <Image src={cat.image_url || ''} alt={cat.name} boxSize="80px" objectFit="contain" />
              <Text
                fontSize="lg"
                fontWeight="semibold"
                textAlign="center"
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                maxW={{ base: '8rem', md: '14rem' }}
              >
                {cat.name}
              </Text>
            </VStack>
          </Link>
        ))}
      </SimpleGrid>
    </Container>
  );
};
