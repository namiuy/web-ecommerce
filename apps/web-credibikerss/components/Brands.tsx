import Link from 'next/link';
import { useBrandList } from 'shared';
import { Carousel, Center, Image } from 'ui';

export const Brands = () => {
  const { isLoading, error, data = [] } = useBrandList();

  if (error) {
    console.log(error);
    return <></>;
  }

  if (isLoading) return <div>Loading...</div>; // TODO:!

  return (
    <Carousel rows={2} slideWidth="10rem" slideHeight="10rem">
      {data.map(({ name, path, logo_url }, i) => (
        <Link key={i} href={path ? path : '/'}>
          <Image
            w="10rem"
            h="10rem"
            src={logo_url}
            alt={name}
            opacity=".5"
            _hover={{ opacity: '1' }}
            fallback={<Center>{name}</Center>}
          />
        </Link>
      ))}
    </Carousel>
  );
};
