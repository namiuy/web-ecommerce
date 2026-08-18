export interface UnifiedResult {
  id: number;
  familyId: number;
  code: string;
  family: string;
  category: string;
  vehicle: string;
  motor: string;
  price: number;
  brand: string;
  year: string;
  origen: string;
}

export interface StockDetail {
  total: number;
  stockNami: number;
  stockClima: number;
  stockSircal: number;
  stockLafelor: number;
  stockAlodenar: number;
}

export interface FamiliaProviderRow {
  Codigo: string;
  Proveedor: string;
  PrecioLista: number;
  stock: StockDetail | null;
}

export interface FamiliaMatch {
  IdFamiliaAutoparte: number;
  CodigoFamilia: string;
  Alto: string | null;
  Ancho: string | null;
  Sistema: string | null;
  Material: string | null;
  proveedores: FamiliaProviderRow[];
}

export interface PartType {
  id: number;
  label: string;
}
