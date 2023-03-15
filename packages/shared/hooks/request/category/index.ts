import useSWRImmutable from 'swr/immutable';
import { list } from '../../../api/category';
import Category from '../../../entities/category';

interface Response<T> {
  isLoading?: boolean;
  data?: T;
  error?: Error;
}

const categoryListId = 'categoryList';

const mapCategory = (category: Category) => ({
  ...category,
  path: `/productos/${encodeURIComponent(category.name.toLowerCase().replaceAll(' ', '-'))}`,
});

const cache = [
  {
    id: '1.1',
    name: 'Adventure',
    imageUrl: 'http://localhost:3001/public/images/category.svg',
    path: '/productos/adventure',
  },
  {
    id: '1.10',
    name: 'Turismo Sport',
    imageUrl: 'http://localhost:3001/public/images/category.svg',
    path: '/productos/turismo-sport',
  },
  {
    id: '1.2',
    name: 'Cub',
    imageUrl: 'http://localhost:3001/public/images/category.svg',
    path: '/productos/cub',
  },
  {
    id: '1.3',
    name: 'Gran Turismo',
    imageUrl: 'http://localhost:3001/public/images/category.svg',
    path: '/productos/gran-turismo',
  },
  {
    id: '1.4',
    name: 'Navi',
    imageUrl: 'http://localhost:3001/public/images/category.svg',
    path: '/productos/navi',
  },
  {
    id: '1.5',
    name: 'Naked',
    imageUrl: 'http://localhost:3001/public/images/category.svg',
    path: '/productos/naked',
  },
  {
    id: '1.6',
    name: 'Scooter',
    imageUrl: 'http://localhost:3001/public/images/category.svg',
    path: '/productos/scooter',
  },
  {
    id: '1.7',
    name: 'Sport',
    imageUrl: 'http://localhost:3001/public/images/category.svg',
    path: '/productos/sport',
  },
  {
    id: '1.8',
    name: 'Street',
    imageUrl: 'http://localhost:3001/public/images/category.svg',
    path: '/productos/street',
  },
  {
    id: '1.9',
    name: 'Super Sport',
    imageUrl: 'http://localhost:3001/public/images/category.svg',
    path: '/productos/super-sport',
  },
  {
    id: '2',
    name: 'Bicicletas',
    imageUrl: 'http://localhost:3001/public/images/category.svg',
    path: '/productos/bicicletas',
  },
  {
    id: '3',
    name: 'Cuatriciclos',
    imageUrl: 'http://localhost:3001/public/images/category.svg',
    path: '/productos/cuatriciclos',
  },
  {
    id: '4',
    name: 'Utilitarios',
    imageUrl: 'http://localhost:3001/public/images/category.svg',
    path: '/productos/utilitarios',
  },
  {
    id: '5',
    name: 'Repuestos',
    imageUrl: 'http://localhost:3001/public/images/category.svg',
    path: '/productos/repuestos',
  },
  {
    id: '6.3',
    name: 'Cascos',
    imageUrl: 'http://localhost:3001/public/images/category.svg',
    path: '/productos/cascos',
  },
] as Array<Category>;

const useCategoryList = (): Response<Array<Category>> => {
  const { isLoading, error, data } = useSWRImmutable(categoryListId, list);

  if (cache) {
    return { isLoading: false, data: cache };
  }

  let dataMapped;

  if (!isLoading && !error && data) {
    dataMapped = data.map(mapCategory);
    // const oneDay = 60 * 24;
    // setCache(dataMapped);
  }

  return { isLoading, error, data: dataMapped };
};

export { useCategoryList };
