import { createContext, ReactElement, useState } from 'react';
import { ProductSearchFilters } from '../entities/product-search';

type AppInitialState = {
  appName: string;
};

type App = AppInitialState & {
  productSearchFilters?: ProductSearchFilters;
  setProductSearchFilters: (data?: ProductSearchFilters) => void;
};

const defaultValues: App = {
  appName: 'APP_NAME',
  setProductSearchFilters: () => {},
  productSearchFilters: undefined,
};

export const AppContext = createContext<App>(defaultValues);

export const AppContextProvider = ({
  initialState,
  children,
}: {
  initialState: AppInitialState;
  children: ReactElement;
}) => {
  const [productSearchFilters, setProductSearchFilters] = useState<ProductSearchFilters | undefined>(
    defaultValues.productSearchFilters
  );

  return (
    <AppContext.Provider value={{ ...initialState, productSearchFilters, setProductSearchFilters }}>
      {children}
    </AppContext.Provider>
  );
};
