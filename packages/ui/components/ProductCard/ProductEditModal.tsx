import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { Product } from 'shared/entities/product';
import { ModalEdit } from '../ModalEdit';
import { ProductForm } from '../ProductForm';

export type ProductEditModalProps = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  product?: Product;
};

export const ProductEditModal: FC<ProductEditModalProps> = ({ isOpen, product, onOpen, onClose }) => {
  const router = useRouter();
  const handleSuccess = () => {
    onClose();
    router.refresh();
  };
  return (
    <ModalEdit isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
      <ProductForm product={product} onSuccess={handleSuccess} />
    </ModalEdit>
  );
};
