import { FC } from 'react';
import { ProductCard as Component, ProductCardProps } from './ProductCard';
import { ProductCardWithEdit } from './ProductCardWithEdit';

export const ProductCard: FC<ProductCardProps & { editMode?: boolean }> = ({ editMode = false, ...props }) => {
  return editMode ? <ProductCardWithEdit {...props} /> : <Component {...props} />;
};
