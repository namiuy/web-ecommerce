export type Category = {
  id: string;
  name: string;
  image_url: string;
  sub_categories?: Array<Category>;
};
