import { Category } from './category';

export type Product = {
  id: number;
  is_original: boolean;
  is_public: boolean;
  created_at: Date;
  category: Category;
  brand: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
};
