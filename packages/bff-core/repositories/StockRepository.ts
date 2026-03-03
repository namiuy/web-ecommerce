import { IStockRepository } from './IStockRepository';
import { Result, createSuccessResult, createErrorResult, createUnhandledError } from '../types';
import { Stock } from '../entities/Stock';

// FastAPI response envelope for stock
type FastAPIStockResponse = {
  success: boolean;
  code?: string;
  server?: string;
  stock: {
    count: number;
    stockNami: number;
    stockClima: number;
    stockSircal: number;
    stockLafelor: number;
    stockAlodenar: number;
    total: number;
    descripcion: string;
    precioLista: number;
    precioCosto: number;
    timeout?: boolean;
  };
};

type FastAPITotalStockResponse = {
  success: boolean;
  code: string;
  total: number;
};

// Mapper function (pure)
const convertToClientStock = (serverStock: FastAPIStockResponse['stock']): Stock => {
  const total = serverStock.total || 0;

  // Determine availability based on total stock
  let availability: 'AV' | 'CO' | 'NO' = 'NO';
  if (total > 10) {
    availability = 'AV';
  } else if (total > 0) {
    availability = 'CO';
  }

  // Create branches array from stock data
  const branches = [];
  if (serverStock.stockNami > 0) {
    branches.push({ code: 'NAMI', quant: serverStock.stockNami });
  }
  if (serverStock.stockClima > 0) {
    branches.push({ code: 'CLIMA', quant: serverStock.stockClima });
  }
  if (serverStock.stockSircal > 0) {
    branches.push({ code: 'SIRCAL', quant: serverStock.stockSircal });
  }
  if (serverStock.stockLafelor > 0) {
    branches.push({ code: 'LAFELOR', quant: serverStock.stockLafelor });
  }
  if (serverStock.stockAlodenar > 0) {
    branches.push({ code: 'ALODENAR', quant: serverStock.stockAlodenar });
  }

  return {
    availability,
    branches,
    total: serverStock.total,
    count: serverStock.count,
    stockNami: serverStock.stockNami,
    stockClima: serverStock.stockClima,
    stockSircal: serverStock.stockSircal,
    stockLafelor: serverStock.stockLafelor,
    stockAlodenar: serverStock.stockAlodenar,
    descripcion: serverStock.descripcion,
    precioLista: serverStock.precioLista,
    precioCosto: serverStock.precioCosto,
    timeout: serverStock.timeout,
  };
};

// Repository factory (functional approach)
export const createStockRepository = (
  apiBaseUrl: string,
  getAuthToken?: () => string
): IStockRepository => {
  return {
    async getByProductCode(productCode: string, server: string = 'lindo4'): Promise<Result<Stock>> {
      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };

        if (getAuthToken) {
          const token = getAuthToken();
          if (token) {
            headers['Authorization'] = `Bearer ${token}`;
          }
        }

        const url = `${apiBaseUrl}/api/stock?code=${encodeURIComponent(productCode)}&server=${encodeURIComponent(server)}`;
        const response = await fetch(url, { headers });

        if (!response.ok) {
          const errorText = await response.text();
          return createErrorResult(createUnhandledError(`HTTP ${response.status}: ${errorText}`));
        }

        const data = (await response.json()) as FastAPIStockResponse;

        // Check if response has success field
        if (data.success === false) {
          return createErrorResult(createUnhandledError('Stock request failed'));
        }

        // Convert server stock format to client format
        const clientStock = convertToClientStock(data.stock);
        return createSuccessResult(clientStock);
      } catch (error) {
        return createErrorResult(createUnhandledError((error as Error).message));
      }
    },

    async getTotalStock(productCode: string): Promise<Result<number>> {
      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };

        if (getAuthToken) {
          const token = getAuthToken();
          if (token) {
            headers['Authorization'] = `Bearer ${token}`;
          }
        }

        const url = `${apiBaseUrl}/api/stock/total/${encodeURIComponent(productCode)}`;
        const response = await fetch(url, { headers });

        if (!response.ok) {
          const errorText = await response.text();
          return createErrorResult(createUnhandledError(`HTTP ${response.status}: ${errorText}`));
        }

        const data = (await response.json()) as FastAPITotalStockResponse;

        // Check if response has success field
        if (data.success === false) {
          return createErrorResult(createUnhandledError('Total stock request failed'));
        }

        return createSuccessResult(data.total);
      } catch (error) {
        return createErrorResult(createUnhandledError((error as Error).message));
      }
    },
  };
};
