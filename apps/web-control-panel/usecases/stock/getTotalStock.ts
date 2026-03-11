import { IStockRepository, Result } from '@namiuy/bff-core';

/**
 * Use case: Get total stock for a product code
 * @param stockRepository - Stock repository instance
 * @returns Function that retrieves total stock by product code
 */
export const createGetTotalStockUseCase = (stockRepository: IStockRepository) => {
  return async (productCode: string): Promise<Result<number>> => {
    return stockRepository.getTotalStock(productCode);
  };
};
