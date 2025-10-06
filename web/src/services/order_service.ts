import { client } from './client';
import type { CreateOrderRequest, FetchOrdersResponse } from './types';

const fetchOrders = async () => {
  try {
    const { data } = await client.get<FetchOrdersResponse>('/orders');

    return data.orders;
  } catch (exception) {
    console.error('Failed to fetch orders', exception);

    return [];
  }
};

const createOrder = async (request: CreateOrderRequest) => {
  return await client.post('/orders', request);
};

export { fetchOrders, createOrder };
