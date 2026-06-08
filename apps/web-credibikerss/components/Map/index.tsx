import imgMapMvd from './map-mvd.jpg';
import imgMapLpa from './map-lpa.jpg';
import imgMapPan from './map-pan.jpg';
// TODO: agregar map-mlv.jpg (screenshot Google Maps Malvín) y map-pir.jpg (Piriápolis) y reemplazar los fallbacks de abajo
import { Box } from 'ui';
import Link from 'next/link';

type MapProps = {
  h: string;
  img: 'MVD' | 'LPA' | 'PAN' | 'MLV' | 'PIR';
  position: { lat: number; lng: number };
  url: string;
};

const getMapImage = (img: MapProps['img']) => {
  switch (img) {
    case 'MVD': return imgMapMvd.src;
    case 'LPA': return imgMapLpa.src;
    case 'MLV': return imgMapMvd.src; // TODO: reemplazar por imgMapMlv.src una vez que se agregue map-mlv.jpg
    case 'PIR': return imgMapPan.src; // TODO: reemplazar por imgMapPir.src una vez que se agregue map-pir.jpg
    case 'PAN':
    default:    return imgMapPan.src;
  }
};

export const Map = ({ h, img, url }: MapProps) => (
  <Link href={url} target="_blank">
    <Box
      w="100%"
      h={h}
      backgroundImage={`url(${getMapImage(img)})`}
      background-position="center"
      backgroundSize="800px"
      backgroundPosition="center"
    />
  </Link>
);
