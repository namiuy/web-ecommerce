import { createContext, ReactElement, useState } from 'react';
import { ProductSearchFilters, ProductSearchOptions, ProductSearchSortBy } from '../entities/product-search';
import { Product } from '../entities/product';

type AppInitialState = {};

type App = AppInitialState & {
  productSearchResultIsLoading?: boolean;
  productSearchResult?: Product[];
  productSearchOptions: ProductSearchOptions;
  setProductSearchResultIsLoading: (isLoading: boolean) => void;
  setProductSearchResult: (products?: Product[]) => void;
  setProductSearchResultFilters: (filters?: ProductSearchFilters) => void;
  setProductSearchSortBy: (sortBy?: ProductSearchSortBy) => void;
};

const defaultValues: App = {
  productSearchOptions: {},
  setProductSearchResultIsLoading: () => {},
  setProductSearchResult: () => {},
  setProductSearchResultFilters: () => {},
  setProductSearchSortBy: () => {},
};

export const AppContext = createContext<App>(defaultValues);

export const AppContextProvider = ({
  // initialState,
  children,
}: {
  // initialState: AppInitialState;
  children: ReactElement;
}) => {
  const [productSearchResultIsLoading, setProductSearchResultIsLoading] = useState<boolean>();
  const [productSearchResult, setProductSearchResult] = useState<Product[]>();
  const [productSearchOptions, setProductSearchOptions] = useState<ProductSearchOptions>(
    defaultValues.productSearchOptions,
  );

  const setProductSearchResultFilters = (filters?: ProductSearchFilters) => {
    setProductSearchOptions({ ...productSearchOptions, filters });
  };
  const setProductSearchSortBy = (sortBy?: ProductSearchSortBy) => {
    console.log('setProductSearchOptions', sortBy);
    setProductSearchOptions({ ...productSearchOptions, sortBy });
  };

  return (
    <AppContext.Provider
      value={{
        productSearchResultIsLoading,
        productSearchResult,
        productSearchOptions,
        setProductSearchResultIsLoading,
        setProductSearchResult,
        setProductSearchResultFilters,
        setProductSearchSortBy,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
