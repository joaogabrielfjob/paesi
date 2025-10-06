import type { AddressResponse, UpsertAddressRequest } from './types';
import { client } from './client';

const fetchAddress = async () => {
  try {
    const { data } = await client.get<AddressResponse>('/address');

    return data;
  } catch (exception) {
    console.error('Failed to fetch address', exception);

    return undefined;
  }
};

const upsertAddress = async (request: UpsertAddressRequest) => {
  return await client.put('/address', request);
};

export { fetchAddress, upsertAddress };
