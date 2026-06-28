import { Product } from './product'

export type Autopart = Product & {
  applications?: Array<{
    brand: string;
    model: string;
    year?: string;
    engine?: string;
  }>;
  family?: string;
  group_code?: string;
  supplier?: string;
  product_type_name?: string;
  similarity_score?: number;
  search_type?: string;
}
