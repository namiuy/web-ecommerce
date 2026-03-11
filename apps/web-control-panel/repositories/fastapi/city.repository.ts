import {
  ICityRepository,
  City,
  Result,
  createSuccessResult,
  createErrorResult,
  createUnhandledError,
} from '@namiuy/bff-core';

// FastAPI types
type FastAPICity = {
  city_id: string;
  city_name: string;
  state_id: string;
  state_name: string;
};

// Mapper function (pure)
const mapCity = (data: FastAPICity): City => ({
  id: data.city_id,
  name: data.city_name,
  stateId: data.state_id,
  state: data.state_name,
});

// Repository factory (functional approach)
export const createCityRepositoryFastAPI = (apiBaseUrl: string): ICityRepository => {
  return {
    list: async (): Promise<Result<City[]>> => {
      try {
        const response = await fetch(`${apiBaseUrl}/cities`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          return createErrorResult(createUnhandledError(errorText));
        }

        const apiCities = (await response.json()) as Array<FastAPICity>;
        const cities = apiCities.map(mapCity);

        return createSuccessResult(cities);
      } catch (error) {
        return createErrorResult(createUnhandledError((error as Error).message));
      }
    },
  };
};
