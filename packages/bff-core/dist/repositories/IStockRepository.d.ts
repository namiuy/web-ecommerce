import { Result } from '../types';
import { Stock } from '../entities/Stock';
export interface IStockRepository {
    getByProductCode(productCode: string, server?: string): Promise<Result<Stock>>;
    getTotalStock(productCode: string): Promise<Result<number>>;
}
//# sourceMappingURL=IStockRepository.d.ts.map