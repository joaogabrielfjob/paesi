import { brasilAPIClient } from './brasilapi_client';
import type { BrasilAPIPostalCodeResponse } from './types';

const fetchPostalCode = async (cep: string) => {
  try {
    const cleanCep = cep.replace(/\D/g, '');

    if (cleanCep.length !== 8) {
      throw new Error('CEP deve conter 8 dígitos');
    }

    const { data } = await brasilAPIClient.get<BrasilAPIPostalCodeResponse>(
      `/cep/v1/${cleanCep}`,
    );

    return data;
  } catch (exception) {
    console.error('Failed to fetch postal code', exception);
    throw exception;
  }
};

export { fetchPostalCode };
