import Link from 'next/link';
import { useCategoryList } from 'shared';
import { Carousel, Image } from 'ui';

export const Categories = () => {
  const { isLoading, error, data = [] } = useCategoryList();

  if (error) {
    console.log(error);
    return <></>;
  }

  if (isLoading) return <div>Loading...</div>; // TODO:!

  return (
    <Carousel rows={2} slideWidth="10rem" slideHeight="10rem">
      {data.map(({ name, path, image_url }, i) => (
        <Link key={i} href={path ? path : '/'}>
          <Image w="10rem" h="10rem" src={image_url} alt={name} />
        </Link>
      ))}
    </Carousel>
  );
};
