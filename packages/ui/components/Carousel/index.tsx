import { Grid, Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Children, ReactNode } from 'react';
// import { MdOutlineNavigateBefore, MdOutlineNavigateNext } from 'react-icons/md';

import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/navigation';
//import './styles.css'; // TODO: !

type CarouselProps = {
  children: ReactNode;
};

export const Carousel = ({ children }: CarouselProps) => (
  <Swiper
    navigation={true}
    slidesPerView="auto"
    grid={{
      rows: 2,
    }}
    modules={[Grid, Navigation]}
    style={{ height: 320 }}
    grabCursor={true}
    // navigation={{
    //   enabled: true,
    //   nextEl: '.image-swiper-button-next',
    //   prevEl: '.image-swiper-button-prev',
    //   disabledClass: 'swiper-button-disabled',
    // }}
  >
    {Children.map(children, (child, i) => {
      return (
        <SwiperSlide key={i} style={{ width: 160, height: 160 }}>
          {child}
        </SwiperSlide>
      );
    })}
  </Swiper>
);
