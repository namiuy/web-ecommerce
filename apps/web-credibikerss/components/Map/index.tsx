import imgMapMvd from './map-mvd.jpg';
import imgMapLpa from './map-lpa.jpg';
import { Box } from 'ui';
import Link from 'next/link';

type MapProps = {
  h: string;
  img: 'MVD' | 'LPA';
  position: { lat: number; lng: number };
  url: string;
};

export const Map = ({ h, img, url }: MapProps) => (
  <Link href={url} target="_blank">
    <Box
      w="100%"
      h={h}
      backgroundImage={`url(${img === 'MVD' ? imgMapMvd.src : imgMapLpa.src})`}
      background-position="center"
      backgroundSize="800px"
      backgroundPosition="center"
    />
  </Link>
);
