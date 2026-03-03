export type Address = {
  address: string;
  previous_address?: string;
  city_id: string;
  previous_city_id?: string;
  city_name: string;
  state_id: string;
  previous_state_id?: string;
  state_name: string;
  postal_code: string;
  previous_postal_code?: string;
  observation?: string;
  is_default?: boolean;
  mode?: string;
};
