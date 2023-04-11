import useSWRImmutable from 'swr/immutable';
import { Brand } from '../../entities/brand';
import { fetcher } from './fetcher';
import { Response } from './response';

const cache = [
  {
    id: 1,
    name: 'AGS',
    path: '/productos/marca/ags',
    logo_url: 'https://wvztopzsrkymsgttryil.supabase.co/storage/v1/object/public/brands/AGS.jpg',
  },
  {
    id: 2,
    name: 'Bajaj',
    path: '/productos/marca/bajaj',
    logo_url: 'https://wvztopzsrkymsgttryil.supabase.co/storage/v1/object/public/brands/Bajaj.jpg',
  },
  {
    id: 3,
    name: 'Beta',
    path: '/productos/marca/beta',
    logo_url: 'https://wvztopzsrkymsgttryil.supabase.co/storage/v1/object/public/brands/Beta.jpg',
  },
  {
    id: 4,
    name: 'Cfmoto',
    path: '/productos/marca/cfmoto',
    logo_url: 'https://wvztopzsrkymsgttryil.supabase.co/storage/v1/object/public/brands/Cfmoto.jpg',
  },
  {
    id: 5,
    name: 'Dirty',
    path: '/productos/marca/dirty',
    logo_url: 'https://wvztopzsrkymsgttryil.supabase.co/storage/v1/object/public/brands/Dirty.jpg',
  },
  {
    id: 6,
    name: 'Haojue',
    path: '/productos/marca/haojue',
    logo_url: 'https://wvztopzsrkymsgttryil.supabase.co/storage/v1/object/public/brands/Haojue.jpg',
  },
  {
    id: 7,
    name: 'Honda',
    path: '/productos/marca/honda',
    logo_url: 'https://wvztopzsrkymsgttryil.supabase.co/storage/v1/object/public/brands/Honda.jpg',
  },
  {
    id: 8,
    name: 'Kawasaki',
    path: '/productos/marca/kawasaki',
    logo_url: 'https://wvztopzsrkymsgttryil.supabase.co/storage/v1/object/public/brands/Kawasaki.jpg',
  },
  {
    id: 9,
    name: 'KTM',
    path: '/productos/marca/ktm',
    logo_url: 'https://wvztopzsrkymsgttryil.supabase.co/storage/v1/object/public/brands/KTM.jpg',
  },
  {
    id: 10,
    name: 'Lifan',
    path: '/productos/marca/lifan',
    logo_url: 'https://wvztopzsrkymsgttryil.supabase.co/storage/v1/object/public/brands/Lifan.jpg',
  },
  {
    id: 11,
    name: 'LS2',
    path: '/productos/marca/ls2',
    logo_url: 'https://wvztopzsrkymsgttryil.supabase.co/storage/v1/object/public/brands/LS2.jpg',
  },
  {
    id: 12,
    name: 'Suzuki',
    path: '/productos/marca/suzuki',
    logo_url: 'https://wvztopzsrkymsgttryil.supabase.co/storage/v1/object/public/brands/Suzuki.jpg',
  },
  {
    id: 13,
    name: 'Sym',
    path: '/productos/marca/sym',
    logo_url: 'https://wvztopzsrkymsgttryil.supabase.co/storage/v1/object/public/brands/Sym.jpg',
  },
  {
    id: 14,
    name: 'Tango',
    path: '/productos/marca/tango',
    logo_url: 'https://wvztopzsrkymsgttryil.supabase.co/storage/v1/object/public/brands/Tango.jpg',
  },
  {
    id: 15,
    name: 'TVS',
    path: '/productos/marca/tvs',
    logo_url: 'https://wvztopzsrkymsgttryil.supabase.co/storage/v1/object/public/brands/TVS.jpg',
  },
  {
    id: 16,
    name: 'Vital',
    path: '/productos/marca/vital',
    logo_url: 'https://wvztopzsrkymsgttryil.supabase.co/storage/v1/object/public/brands/Vital.jpg',
  },
  {
    id: 17,
    name: 'Yamaha',
    path: '/productos/marca/yamaha',
    logo_url: 'https://wvztopzsrkymsgttryil.supabase.co/storage/v1/object/public/brands/Yamaha.jpg',
  },
  {
    id: 18,
    name: 'Zanella',
    path: '/productos/marca/zanella',
    logo_url: 'https://wvztopzsrkymsgttryil.supabase.co/storage/v1/object/public/brands/Zanella.jpg',
  },
  {
    id: 19,
    name: 'Zontes',
    path: '/productos/marca/zontes',
    logo_url: 'https://wvztopzsrkymsgttryil.supabase.co/storage/v1/object/public/brands/Zontes.jpg',
  },
];

const useBrandList = (): Response<Array<Brand>> => {
  return { isLoading: false, data: cache };
  const { isLoading, error, data } = useSWRImmutable('http://localhost:3001/brand', fetcher);

  if (cache) {
    return { isLoading: false, data: cache };
  }

  // let dataMapped;

  // if (!isLoading && !error && data) {
  //   dataMapped = data.map(mapCategory);
  //   // const oneDay = 60 * 24;
  //   // setCache(dataMapped);
  // }

  return { isLoading, error, data };
};

export { useBrandList };
