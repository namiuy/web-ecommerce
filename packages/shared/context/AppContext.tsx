import { createContext, ReactElement, useState } from 'react';
import { ProductSearchFilters, ProductSearchOptions, ProductSearchSortBy } from '../entities/product-search';

type AppInitialState = {
  appName: string;
  toggleTheme?: () => void;
};

type App = AppInitialState & {
  productSearchOptions: ProductSearchOptions;
  setProductSearchResultFilters: (filters?: ProductSearchFilters) => void;
  setProductSearchSortBy: (sortBy?: ProductSearchSortBy) => void;
};

const defaultValues: App = {
  appName: 'APP_NAME',
  setProductSearchResultFilters: () => {},
  setProductSearchSortBy: () => {},
  productSearchOptions: {},
};

export const AppContext = createContext<App>(defaultValues);

export const AppContextProvider = ({
  initialState,
  children,
}: {
  initialState: AppInitialState;
  children: ReactElement;
}) => {
  const [productSearchOptions, setProductSearchOptions] = useState<ProductSearchOptions>(
    defaultValues.productSearchOptions
  );
  const setProductSearchResultFilters = (filters?: ProductSearchFilters) => {
    console.log('setProductSearchResultFilters', filters);
    setProductSearchOptions({ ...productSearchOptions, filters });
  };
  const setProductSearchSortBy = (sortBy?: ProductSearchSortBy) => {
    console.log('setProductSearchOptions', sortBy);
    setProductSearchOptions({ ...productSearchOptions, sortBy });
  };

  return (
    <AppContext.Provider
      value={{ ...initialState, productSearchOptions, setProductSearchResultFilters, setProductSearchSortBy }}
    >
      {children}
    </AppContext.Provider>
  );
};
