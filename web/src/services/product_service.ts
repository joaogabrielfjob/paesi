import { client } from './client';
import type { FetchProductsResponse } from './types';

const fetchProducts = async () => {
  try {
    const { data } = await client.get<FetchProductsResponse>('/products');

    return data.products;
  } catch (exception) {
    console.error('Failed to fetch products', exception);

    return [];
  }
};

export { fetchProducts };
