import { IStockRepository, Stock, Result } from '@namiuy/bff-core';

/**
 * Use case: Get stock information for a product code
 * @param stockRepository - Stock repository instance
 * @returns Function that retrieves stock by product code
 */
export const createGetStockByProductCodeUseCase = (stockRepository: IStockRepository) => {
  return async (productCode: string, server?: string): Promise<Result<Stock>> => {
    return stockRepository.getByProductCode(productCode, server);
  };
};
