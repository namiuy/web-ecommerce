import Link from 'next/link';
import { getEmptyArray, useBrandList } from 'shared';
import { Center, Image, Flex, Skeleton, Box } from 'ui';

const LOADING_LENGTH = 14;

const _w = '6rem';
const _h = '4rem';

export const Brands = () => {
  const { isLoading, error, data = [] } = useBrandList();

  if (error) {
    console.log(error);
    return <></>;
  }

  return (
    <Flex wrap="wrap" p="1rem" gap={{ base: '2rem', lg: '3rem' }} justifyContent="space-around">
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
                fallback={<Box w={_w} h={_h}></Box>}
              />
            </Link>
          ))}
    </Flex>
  );
};
