import { createContext } from 'react';

type AppContext = {
  appName: string;
};

const initialValues: AppContext = {
  appName: 'APP_NAME',
};

export const AppContext = createContext(initialValues);
