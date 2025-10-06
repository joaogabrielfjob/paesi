import { OrderCard } from '@/components/OrderCard';
import { fetchOrders } from '@/services/order_service';
import { useLoading } from '@/hooks/use_loading';
import { useQuery } from '@tanstack/react-query';

export function Orders() {
  const { data: orders, fetchStatus } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => await fetchOrders(),
  });

  useLoading([fetchStatus]);

  return (
    <div className='min-h-screen flex flex-col px-6 py-6 pb-20'>
      <div className='w-full grid grid-cols-1 gap-4 mt-[40px]'>
        {orders?.length ? (
          orders.map((order) => {
            return <OrderCard key={order.id} order={order} />;
          })
        ) : (
          <p className='text-gray-600 text-center'>
            Você ainda não tem pedidos.
          </p>
        )}
      </div>
    </div>
  );
}
