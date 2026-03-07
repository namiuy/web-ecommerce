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

// FastAPI types (using actual database column names in PascalCase)
type FastAPIPerson = {
  PersonId: number;
  PersonName: string;
  PersonLastName: string;
  PersonDefaultEmail: string;
  PersonDefaultPhone?: string;
  phones?: Array<{
    PePhone: string;
  }>;
  addresses?: Array<{
    PeAddress: string;
    CityId: number;
    CityName?: string;
    StateId: number;
    StateName?: string;
    PeAddressZIPCode?: number;
  }>;
};

// Mapper function (pure)
const mapPerson = (data: FastAPIPerson): Person => ({
  id: data.PersonId.toString(),
  name: (data.PersonName || '').trim(),
  last_name: (data.PersonLastName || '').trim(),
  email: (data.PersonDefaultEmail || '').trim(),
  default_phone: (data.PersonDefaultPhone || '').trim(),
  default_address: '',
  phones: data.phones?.map(phone => ({
    number: (phone.PePhone || '').trim(),
    is_default: phone.PePhone === data.PersonDefaultPhone,
  })) || [],
  addresses: data.addresses?.map(address => ({
    address: (address.PeAddress || '').trim(),
    city_id: address.CityId.toString(),
    city_name: (address.CityName || '').trim(),
    state_id: address.StateId.toString(),
    state_name: (address.StateName || '').trim(),
    postal_code: address.PeAddressZIPCode?.toString() || '',
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
        const response = await fetch(`${apiBaseUrl}/persons/${id}`, {
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

        const data = await response.json();
        const apiPerson = data.person as FastAPIPerson;
        // Add addresses from separate array in response
        apiPerson.addresses = data.addresses || [];
        return createSuccessResult(mapPerson(apiPerson));
      } catch (error) {
        return createErrorResult(createUnhandledError((error as Error).message));
      }
    },

    update: async (person: PersonUpdate): Promise<Result<boolean>> => {
      try {
        // Map addresses and phones to backend format if they exist
        const body: any = {};

        if (person.addresses && person.addresses.length > 0) {
          body.addresses = person.addresses.map(addr => ({
            address: addr.address,
            cityId: parseInt(addr.city_id),
            zipCode: addr.postal_code ? parseInt(addr.postal_code) : 0,
            observation: addr.observation || '',
          }));
        }

        if (person.phones && person.phones.length > 0) {
          body.phones = person.phones.map(phone => ({
            phone: phone.number,
            type: 'CEL',
          }));
        }

        const response = await fetch(`${apiBaseUrl}/persons/${person.id}`, {
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
