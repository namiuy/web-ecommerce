import Link from 'next/link';
import { getEmptyArray, useBrandList } from 'shared';
import { Image, Flex, Skeleton, Center } from 'ui';

const LOADING_LENGTH = 14;

const _w = '5rem';
const _h = '4rem';

const _grey2 = 'brand.grey.2';

export const Brands = () => {
  const { isLoading, error, data = [] } = useBrandList();

  if (error) {
    console.log(error);
    return <></>;
  }

  return (
    <Flex wrap="wrap" p="2rem 1rem" gap={{ base: '2rem', lg: '3rem' }} justifyContent="space-around">
      {isLoading
        ? getEmptyArray(LOADING_LENGTH).map((_, i) => <Skeleton key={i} w={_w} h={_h} />)
        : data.map(({ name, path, logo_url }, i) => (
            <Link key={i} href={path ? path : '/'}>
              <Image
                w={_w}
                h={_h}
                src={logo_url}
                alt={name}
                opacity=".7"
                fit="cover"
                _hover={{ opacity: '1' }}
                fallback={
                  <Flex w={_w} h={_h}>
                    <Center w="100%" textAlign="center" color={_grey2}>
                      {name}
                    </Center>
                  </Flex>
                }
              />
            </Link>
          ))}
    </Flex>
  );
};
