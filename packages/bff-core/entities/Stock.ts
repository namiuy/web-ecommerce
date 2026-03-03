export interface StockBranch {
  code: string;
  quant: number;
}

export interface Stock {
  availability: 'AV' | 'CO' | 'NO';
  branches: StockBranch[];
  count?: number;
  total?: number;
  stockNami?: number;
  stockClima?: number;
  stockSircal?: number;
  stockLafelor?: number;
  stockAlodenar?: number;
  descripcion?: string;
  precioLista?: number;
  precioCosto?: number;
  timeout?: boolean;
}
