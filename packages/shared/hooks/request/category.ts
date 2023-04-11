import useSWRImmutable from 'swr/immutable';
import { Category } from '../../entities/category';
import { fetcher } from './fetcher';
import { Response } from './response';

const cache = [
  {
    id: '1',
    name: 'Motos',
    path: '/productos/motos',
    image_url: 'https://wvztopzsrkymsgttryil.supabase.co/storage/v1/object/public/categories/Motos.jpg',
    subCategories: [
      {
        id: '1.1',
        name: 'Adventure',
        path: '/productos/adventure',
        image_url: 'https://wvztopzsrkymsgttryil.supabase.co/storage/v1/object/public/categories/Adventure.jpg',
      },
      {
        id: '1.2',
        name: 'Cub',
        path: '/productos/cub',
        image_url: 'https://wvztopzsrkymsgttryil.supabase.co/storage/v1/object/public/categories/Cub.jpg',
      },
      {
        id: '1.3',
        name: 'Gran Turismo',
        path: '/productos/gran-turismo',
        image_url: 'https://wvztopzsrkymsgttryil.supabase.co/storage/v1/object/public/categories/Gran Turismo.jpg',
      },
      {
        id: '1.4',
        name: 'Navi',
        path: '/productos/navi',
        image_url: 'https://wvztopzsrkymsgttryil.supabase.co/storage/v1/object/public/categories/Navi.jpg',
      },
      {
        id: '1.5',
        name: 'Naked',
        path: '/productos/naked',
        image_url: 'https://wvztopzsrkymsgttryil.supabase.co/storage/v1/object/public/categories/Naked.jpg',
      },
      {
        id: '1.6',
        name: 'Scooter',
        path: '/productos/scooter',
        image_url: 'https://wvztopzsrkymsgttryil.supabase.co/storage/v1/object/public/categories/Scooter.jpg',
      },
      {
        id: '1.7',
        name: 'Sport',
        path: '/productos/sport',
        image_url: 'https://wvztopzsrkymsgttryil.supabase.co/storage/v1/object/public/categories/Sport.jpg',
      },
      {
        id: '1.8',
        name: 'Street',
        path: '/productos/street',
        image_url: 'https://wvztopzsrkymsgttryil.supabase.co/storage/v1/object/public/categories/Street.jpg',
      },
      {
        id: '1.9',
        name: 'Super Sport',
        path: '/productos/super-sport',
        image_url: 'https://wvztopzsrkymsgttryil.supabase.co/storage/v1/object/public/categories/Super Sport.jpg',
      },
      {
        id: '1.10',
        name: 'Turismo Sport',
        path: '/productos/turismo-sport',
        image_url: 'https://wvztopzsrkymsgttryil.supabase.co/storage/v1/object/public/categories/Turismo Sport.jpg',
      },
    ],
  },
  {
    id: '2',
    name: 'Bicicletas',
    path: '/productos/bicicletas',
    image_url: 'https://wvztopzsrkymsgttryil.supabase.co/storage/v1/object/public/categories/Bicicletas.jpg',
  },
  {
    id: '3',
    name: 'Cuatriciclos',
    path: '/productos/cuatriciclos',
    image_url: 'https://wvztopzsrkymsgttryil.supabase.co/storage/v1/object/public/categories/Cuatriciclos.jpg',
  },
  {
    id: '4',
    name: 'Utilitarios',
    path: '/productos/utilitarios',
    image_url: 'https://wvztopzsrkymsgttryil.supabase.co/storage/v1/object/public/categories/Utilitarios.jpg',
  },
  {
    id: '5',
    name: 'Repuestos',
    path: '/productos/repuestos',
    image_url: 'https://wvztopzsrkymsgttryil.supabase.co/storage/v1/object/public/categories/Repuestos.jpg',
  },
  {
    id: '6',
    name: 'Indumentaria',
    path: '/productos/indumentaria',
    image_url: 'https://wvztopzsrkymsgttryil.supabase.co/storage/v1/object/public/categories/Indumentaria.jpg',
    subCategories: [
      {
        id: '6.1',
        name: 'Botas',
        path: '/productos/botas',
        image_url: 'https://wvztopzsrkymsgttryil.supabase.co/storage/v1/object/public/categories/Botas.jpg',
      },
      {
        id: '6.2',
        name: 'Camperas',
        path: '/productos/camperas',
        image_url: 'https://wvztopzsrkymsgttryil.supabase.co/storage/v1/object/public/categories/Camperas.jpg',
      },
      {
        id: '6.3',
        name: 'Cascos',
        path: '/productos/cascos',
        image_url: 'https://wvztopzsrkymsgttryil.supabase.co/storage/v1/object/public/categories/Cascos.jpg',
      },
      {
        id: '6.4',
        name: 'Chaleco',
        path: '/productos/chaleco',
        image_url: 'https://wvztopzsrkymsgttryil.supabase.co/storage/v1/object/public/categories/Chaleco.jpg',
      },
      {
        id: '6.5',
        name: 'Chaquetas',
        path: '/productos/chaquetas',
        image_url: 'https://wvztopzsrkymsgttryil.supabase.co/storage/v1/object/public/categories/Chaquetas.jpg',
      },
      {
        id: '6.6',
        name: 'Guantes',
        path: '/productos/guantes',
        image_url: 'https://wvztopzsrkymsgttryil.supabase.co/storage/v1/object/public/categories/Guantes.jpg',
      },
      {
        id: '6.7',
        name: 'Mochilas',
        path: '/productos/mochilas',
        image_url: 'https://wvztopzsrkymsgttryil.supabase.co/storage/v1/object/public/categories/Mochilas.jpg',
      },
      {
        id: '6.8',
        name: 'Pantalones',
        path: '/productos/pantalones',
        image_url: 'https://wvztopzsrkymsgttryil.supabase.co/storage/v1/object/public/categories/Pantalones.jpg',
      },
    ],
  },
];

const useCategoryList = (): Response<Array<Category>> => {
  return { isLoading: false, data: cache };

  const { isLoading, error, data } = useSWRImmutable('http://localhost:3001/category', fetcher);

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

export { useCategoryList };
