// import { Box, Image } from '@chakra-ui/react';
// import Link from 'next/link';
// import { useCategoryList } from '../../hooks/request/category/useList';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Grid, Navigation } from 'swiper';

import { Box } from '@chakra-ui/react';

// import 'swiper/css';
// import 'swiper/css/grid';
// import 'swiper/css/navigation';

export const Banner = () => {
  // const { isLoading, error, data } = useCategoryList();
  // if (error) return <div>Error!</div>;

  // if (isLoading) return <div>Loading...</div>;

  // return (
  //   <Swiper
  //     navigation={true}
  //     slidesPerView="auto"
  //     grid={{
  //       rows: 2,
  //     }}
  //     modules={[Grid, Navigation]}
  //     style={{ height: 320 }}
  //     grabCursor={true}
  //   >
  //     {data.map(({ id, name, path, imageUrl }) => (
  //       <SwiperSlide key={id} style={{ width: 160, height: 160 }}>
  //         <Link href={path ? path : '/'}>
  //           <Image w="10rem" h="10rem" src={imageUrl} alt={name} />
  //         </Link>
  //       </SwiperSlide>
  //     ))}
  //   </Swiper>
  // );
  return <Box w="100%" h="10rem" bg="#1DD47D" />;
};
