import { FC } from 'react';
import { ProductCard as Component, ProductCardProps } from './ProductCard';
import { ProductCardWithEdit } from './ProductCardWithEdit';

export const ProductCard: FC<ProductCardProps & { edit?: boolean }> = ({ edit = false, ...props }) => {
  return edit ? <ProductCardWithEdit {...props} /> : <Component {...props} />;
};
