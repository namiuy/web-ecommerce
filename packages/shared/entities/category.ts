export type Category = {
  id: string;
  name: string;
  path: string;
  image_url: string;
  sub_categories?: Array<Category>;
  is_sub_category: boolean;
  parent?: string;
};
