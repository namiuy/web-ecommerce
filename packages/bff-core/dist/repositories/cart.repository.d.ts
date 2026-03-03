import { Result } from '../types';
import { Cart, CartItem } from '../entities';
export type ICartRepository = {
    get: () => Promise<Result<Cart>>;
    add: (item: Partial<CartItem>) => Promise<Result<Cart>>;
    update: (item: Partial<CartItem>) => Promise<Result<Cart>>;
    delete: (item: Partial<CartItem>) => Promise<Result<Cart>>;
};
//# sourceMappingURL=cart.repository.d.ts.map