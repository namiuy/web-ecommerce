import Link from 'next/link';
import { useCategoryList } from 'shared';
import { Carousel, Image } from 'ui';

export const Categories = () => {
  const { isLoading, error, data = [] } = useCategoryList();

  if (error) return <div>Error!</div>; // TODO:!

  if (isLoading) return <div>Loading...</div>; // TODO:!

  return (
    <Carousel>
      {data.map(({ id, name, path, imageUrl }, i) => (
        <Link key={i} href={path ? path : '/'}>
          <Image w="10rem" h="10rem" src={imageUrl} alt={name} />
        </Link>
      ))}
    </Carousel>
  );
};
