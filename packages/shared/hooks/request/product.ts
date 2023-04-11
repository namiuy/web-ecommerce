import useSWRImmutable from 'swr/immutable';
import { Product } from '../../entities/product';
import { addSearchParamsToUrl } from '../../utils/url';
import { fetcher } from './fetcher';
import { Response } from './response';

type ProductSearchProps = {
  brandId?: number;
  categoryId?: string;
  text?: string;
};

const cache = [
  {
    id: 'BA-NS200FI',
    is_original: false,
    is_public: false,
    name: 'Pulsar NS 200cc Fi',
    description: '',
    category: { id: '1.7', name: 'Sport' },
    brand: { id: 2, name: 'Bajaj' },
    price: 5490,
    brand_name: 'Bajaj',
    category_name: 'Sport',
    path: '/productos/ba-ns200fi',
    image_url: 'https://wvztopzsrkymsgttryil.supabase.co/storage/v1/object/public/products/BA-NS200FI.jpg',
  },
  {
    id: 'BA-PULNS125',
    is_original: false,
    is_public: false,
    name: 'Pulsar NS 125cc',
    description: '',
    category: { id: '1.8', name: 'Street' },
    brand: { id: 2, name: 'Bajaj' },
    price: 2190,
    brand_name: 'Bajaj',
    category_name: 'Street',
    path: '/productos/ba-pulns125',
    image_url: 'https://wvztopzsrkymsgttryil.supabase.co/storage/v1/object/public/products/BA-PULNS125.jpg',
  },
  {
    id: 'BA-PULNS200',
    is_original: false,
    is_public: false,
    name: 'Pulsar NS 200cc Carburada',
    description: '',
    category: { id: '1.9', name: 'Super Sport' },
    brand: { id: 2, name: 'Bajaj' },
    price: 4990,
    brand_name: 'Bajaj',
    category_name: 'Super Sport',
    path: '/productos/ba-pulns200',
    image_url: 'https://wvztopzsrkymsgttryil.supabase.co/storage/v1/object/public/products/BA-PULNS200.jpg',
  },
  {
    id: 'BA-PULRS200',
    is_original: false,
    is_public: false,
    name: 'Pulsar RS 200cc',
    description: '',
    category: { id: '1.7', name: 'Sport' },
    brand: { id: 2, name: 'Bajaj' },
    price: 6290,
    brand_name: 'Bajaj',
    category_name: 'Sport',
    path: '/productos/ba-pulrs200',
    image_url: 'https://wvztopzsrkymsgttryil.supabase.co/storage/v1/object/public/products/BA-PULRS200.jpg',
  },
];

export const useProductGet = (id: number): Response<Product> => {
  const { isLoading, error, data } = useSWRImmutable(`http://localhost:3001/product/${id}`, fetcher);

  // if (cache) {
  //   return { isLoading: false, data: cache };
  // }

  return { isLoading, error, data };
};

export const useProductSearch = ({ brandId, categoryId, text }: ProductSearchProps): Response<Array<Product>> => {
  //return { isLoading: false, data: cache as unknown as Array<Product> };

  const filters = {
    b: brandId?.toString(),
    c: categoryId?.toString(),
    t: text?.toString(),
  };
  const url = addSearchParamsToUrl('http://localhost:3001/product/search', filters);
  const { isLoading, error, data } = useSWRImmutable(url, fetcher);

  // if (cache) {
  //   return { isLoading: false, data: cache };
  // }

  return { isLoading, error, data };
};
