import {
  IStateRepository,
  State,
  Result,
  createSuccessResult,
  createErrorResult,
  createUnhandledError,
} from '@namiuy/bff-core';

// FastAPI types
type FastAPIState = {
  state_id: string;
  state_name: string;
};

// Mapper function (pure)
const mapState = (data: FastAPIState): State => ({
  id: data.state_id,
  code: data.state_id,
  name: data.state_name,
});

// Repository factory (functional approach)
export const createStateRepositoryFastAPI = (apiBaseUrl: string): IStateRepository => {
  return {
    list: async (): Promise<Result<State[]>> => {
      try {
        const response = await fetch(`${apiBaseUrl}/states`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          return createErrorResult(createUnhandledError(errorText));
        }

        const apiStates = (await response.json()) as Array<FastAPIState>;
        const states = apiStates.map(mapState);

        return createSuccessResult(states);
      } catch (error) {
        return createErrorResult(createUnhandledError((error as Error).message));
      }
    },
  };
};
