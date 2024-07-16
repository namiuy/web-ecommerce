import { useRouter } from 'next/navigation';
import { Product } from 'shared/entities/product';
import { ModalEdit } from './ModalEdit';
import { ProductForm } from './ProductForm';

export type ProductEditModalProps = {
  isOpen: boolean;
  product?: Product;
  scrollBehavior?: 'outside' | 'inside';
  onOpen: () => void;
  onClose: () => void;
};

export const ProductEditModal = ({ isOpen, product, scrollBehavior, onOpen, onClose }: ProductEditModalProps) => {
  const router = useRouter();
  const handleSuccess = () => {
    onClose();
    router.refresh();
  };
  return (
    <ModalEdit isOpen={isOpen} scrollBehavior={scrollBehavior} onOpen={onOpen} onClose={onClose}>
      <ProductForm product={product} onSuccess={handleSuccess} />
    </ModalEdit>
  );
};
