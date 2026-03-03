import {
  IPersonRepository,
  Person,
  PersonUpdate,
  Result,
  createSuccessResult,
  createErrorResult,
  createUnhandledError,
  UNAUTHORIZED,
} from '@namiuy/bff-core';

// FastAPI types
type FastAPIPerson = {
  person_id: number;
  person_name: string;
  person_last_name: string;
  person_default_email: string;
  person_default_phone?: string;
  phones?: Array<{
    pe_phone: string;
  }>;
  addresses?: Array<{
    pe_address: string;
    city_id: string;
    city_name?: string;
    state_id: string;
    state_name?: string;
    pe_address_zip_code?: string;
  }>;
};

// Mapper function (pure)
const mapPerson = (data: FastAPIPerson): Person => ({
  id: data.person_id.toString(),
  name: data.person_name,
  last_name: data.person_last_name,
  email: data.person_default_email,
  default_phone: data.person_default_phone || '',
  default_address: '',
  phones: data.phones?.map(phone => ({
    number: phone.pe_phone,
    is_default: phone.pe_phone === data.person_default_phone,
  })) || [],
  addresses: data.addresses?.map(address => ({
    address: address.pe_address,
    city_id: address.city_id,
    city_name: address.city_name || '',
    state_id: address.state_id,
    state_name: address.state_name || '',
    postal_code: address.pe_address_zip_code || '',
    is_default: false,
  })) || [],
});

// Repository factory (functional approach)
export const createPersonRepositoryFastAPI = (
  apiBaseUrl: string,
  getAuthToken?: () => string | null
): IPersonRepository => {
  const getHeaders = (): HeadersInit => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (getAuthToken) {
      const token = getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return headers;
  };

  return {
    get: async (id: string): Promise<Result<Person>> => {
      try {
        const params = new URLSearchParams({ id });
        const response = await fetch(`${apiBaseUrl}/person?${params.toString()}`, {
          method: 'GET',
          headers: getHeaders(),
        });

        if (!response.ok) {
          if (response.status === 401) {
            return createErrorResult(UNAUTHORIZED);
          }
          const errorText = await response.text();
          return createErrorResult(createUnhandledError(errorText));
        }

        const apiPerson = (await response.json()) as FastAPIPerson;
        return createSuccessResult(mapPerson(apiPerson));
      } catch (error) {
        return createErrorResult(createUnhandledError((error as Error).message));
      }
    },

    update: async (person: PersonUpdate): Promise<Result<boolean>> => {
      try {
        const body = {
          id: person.id,
          phones: person.phones,
          addresses: person.addresses,
          update_user: person.update_user,
          guid: person.guid,
        };

        const response = await fetch(`${apiBaseUrl}/person`, {
          method: 'PUT',
          headers: getHeaders(),
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          const errorText = await response.text();
          return createErrorResult(createUnhandledError(errorText));
        }

        return createSuccessResult(true);
      } catch (error) {
        return createErrorResult(createUnhandledError((error as Error).message));
      }
    },
  };
};
