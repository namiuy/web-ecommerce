import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { Skeleton } from './Skeleton';
import { keys } from 'shared';
import { Children, FC, isValidElement, useEffect, useRef, useState, cloneElement, ReactNode } from 'react';
import { Box } from '..';
import styled from '@emotion/styled';

const { googleMapsApiKey } = keys;

const styles = [
  {
    featureType: 'all',
    elementType: 'all',
    stylers: [
      {
        invert_lightness: true,
      },
      {
        hue: '#a7ff00',
      },
      {
        saturation: '-100',
      },
      {
        gamma: '1.00',
      },
      {
        lightness: '5',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'all',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'transit',
    elementType: 'all',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      {
        color: '#2D333C',
      },
    ],
  },
];

const StyleWrapper = styled.div`
  .gm-style-cc {
    display: none;
  }
`;

type Position = { lat: number; lng: number };

type MapComponentProps = {
  w: string | number;
  h: string | number;
  center: Position;
  zoom: number;
  children: ReactNode;
};

type MapProps = {
  w?: string | number;
  h?: string | number;
  zoom?: number;
  position: Position;
};

// @ts-ignore
const Marker: React.FC<window.google.maps.MarkerOptions> = options => {
  // @ts-ignore
  const [marker, setMarker] = useState<window.google.maps.Marker>();

  useEffect(() => {
    if (!marker) {
      // @ts-ignore
      setMarker(new window.google.maps.Marker());
    }

    // remove marker from map on unmount
    return () => {
      if (marker) {
        marker.setMap(null);
      }
    };
  }, [marker]);

  useEffect(() => {
    if (marker) {
      marker.setOptions(options);
    }
  }, [marker, options]);

  return null;
};

const MyMapComponent: React.FC<MapComponentProps> = ({ w, h, children, ...options }) => {
  const ref = useRef<HTMLDivElement>(null);
  // @ts-ignore
  const [map, setMap] = useState<window.google.maps.Map>();

  useEffect(() => {
    if (ref.current && !map) {
      // @ts-ignore
      const map = new window.google.maps.Map(ref.current, {});
      map.setOptions({
        ...options,
        disableDefaultUI: true,
        styles,
      });
      setMap(map);
    }
  }, [ref, map, options]);

  return (
    <>
      <Box ref={ref} w={w} h={h} />
      {Children.map(children, child => {
        if (isValidElement(child)) {
          // set the map prop on the child component
          // @ts-ignore
          return cloneElement(child, { map });
        }
      })}
    </>
  );
};

export const Map: FC<MapProps> = ({ w = '100%', h = '100%', zoom = 16, position }) => {
  const render = (status: Status) => {
    if (status === Status.LOADING) return <Skeleton w={w} h={h} />;
    if (status === Status.FAILURE) console.log(status);
    return <></>;
  };

  return (
    <Wrapper apiKey={googleMapsApiKey} render={render}>
      <StyleWrapper>
        <MyMapComponent w={w} h={h} center={position} zoom={zoom}>
          <Marker position={position} />
        </MyMapComponent>
      </StyleWrapper>
    </Wrapper>
  );
};
