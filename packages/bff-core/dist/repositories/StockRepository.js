"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStockRepository = void 0;
const types_1 = require("../types");
// Mapper function (pure)
const convertToClientStock = (serverStock) => {
    const total = serverStock.total || 0;
    // Determine availability based on total stock
    let availability = 'NO';
    if (total > 10) {
        availability = 'AV';
    }
    else if (total > 0) {
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
const createStockRepository = (apiBaseUrl, getAuthToken) => {
    return {
        async getByProductCode(productCode, server = 'lindo4') {
            try {
                const headers = {
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
                    return (0, types_1.createErrorResult)((0, types_1.createUnhandledError)(`HTTP ${response.status}: ${errorText}`));
                }
                const data = (await response.json());
                // Check if response has success field
                if (data.success === false) {
                    return (0, types_1.createErrorResult)((0, types_1.createUnhandledError)('Stock request failed'));
                }
                // Convert server stock format to client format
                const clientStock = convertToClientStock(data.stock);
                return (0, types_1.createSuccessResult)(clientStock);
            }
            catch (error) {
                return (0, types_1.createErrorResult)((0, types_1.createUnhandledError)(error.message));
            }
        },
        async getTotalStock(productCode) {
            try {
                const headers = {
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
                    return (0, types_1.createErrorResult)((0, types_1.createUnhandledError)(`HTTP ${response.status}: ${errorText}`));
                }
                const data = (await response.json());
                // Check if response has success field
                if (data.success === false) {
                    return (0, types_1.createErrorResult)((0, types_1.createUnhandledError)('Total stock request failed'));
                }
                return (0, types_1.createSuccessResult)(data.total);
            }
            catch (error) {
                return (0, types_1.createErrorResult)((0, types_1.createUnhandledError)(error.message));
            }
        },
    };
};
exports.createStockRepository = createStockRepository;
