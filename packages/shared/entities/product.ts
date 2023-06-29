import { Brand } from './brand';
import { Category } from './category';

export type Product = {
  id: string;
  is_original: boolean;
  is_public: boolean;
  created_at: Date;
  category: Category;
  brand: Brand;
  name: string;
  description: string;
  price: number;
  image_url: string;
  path: string;
};
