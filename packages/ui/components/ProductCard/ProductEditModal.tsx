import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { Product } from 'shared/entities/product';
import { ModalEdit } from '../ModalEdit';
import { ProductForm } from '../ProductForm';
import lscache from 'lscache';

export type ProductEditModalProps = {
  isOpen: boolean;
  product?: Product;
  scrollBehavior?: 'outside' | 'inside';
  onOpen: () => void;
  onClose: () => void;
};

export const ProductEditModal: FC<ProductEditModalProps> = ({ isOpen, product, scrollBehavior, onOpen, onClose }) => {
  const router = useRouter();
  const handleSuccess = () => {
    onClose();
    lscache.flush(); // TODO: improve this
    router.refresh();
  };
  return (
    <ModalEdit isOpen={isOpen} scrollBehavior={scrollBehavior} onOpen={onOpen} onClose={onClose}>
      <ProductForm product={product} onSuccess={handleSuccess} />
    </ModalEdit>
  );
};
