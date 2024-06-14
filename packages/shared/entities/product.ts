import { Brand } from './brand';
import { Category } from './category';
import { RelatedLink } from './related-link';
import { Specification } from './specification';

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
  stock: 'NO' | 'CO' | 'AV';
  specifications: Specification[];
  related_links: RelatedLink[];
  price_without_tax: number;
  discount: number;
};
