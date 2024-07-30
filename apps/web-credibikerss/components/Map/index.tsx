import imgMapMvd from './map-mvd.jpg';
import imgMapLpa from './map-lpa.jpg';
import imgMapPan from './map-pan.jpg';
import { Box } from 'ui';
import Link from 'next/link';

type MapProps = {
  h: string;
  img: 'MVD' | 'LPA' | 'PAN';
  position: { lat: number; lng: number };
  url: string;
};

export const Map = ({ h, img, url }: MapProps) => (
  <Link href={url} target="_blank">
    <Box
      w="100%"
      h={h}
      backgroundImage={`url(${img === 'MVD' ? imgMapMvd.src : img === 'LPA' ? imgMapLpa.src : imgMapPan.src})`}
      background-position="center"
      backgroundSize="800px"
      backgroundPosition="center"
    />
  </Link>
);
