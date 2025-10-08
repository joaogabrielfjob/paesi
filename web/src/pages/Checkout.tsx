import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { CreateOrderRequest, StoredCart } from '@/services/types';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '@/services/order_service';
import { useMutation } from '@tanstack/react-query';

export function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<StoredCart>({ products: [] });
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    const storedCart = localStorage.getItem('order');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  const createOrderMutation = useMutation({
    mutationFn: (request: CreateOrderRequest) => {
      return createOrder(request);
    },
    onSuccess: () => {
      localStorage.removeItem('order');

      navigate('/pedidos');
    },
    onError: (error) => {
      console.error('Create order failed:', error);
    }
  });

  const formatToCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const subtotal = cart.products.reduce(
    (total, cp) => total + cp.quantity * cp.product.price,
    0
  );
  const shipping = 10.0;
  const total = subtotal + shipping - discount;

  const handleApplyPromoCode = () => {
    if (promoCode.toUpperCase() === 'DESC5') {
      setDiscount(5.0);
    } else {
      setDiscount(0);
    }
  };

  const handleFinalize = async () => {
    const request = {
      products: cart.products.map((cp) => ({
        productId: cp.product.id,
        quantity: cp.quantity
      }))
    };

    createOrderMutation.mutate(request);
  };

  return (
    <div className='flex flex-col px-6 py-6'>
      <div className='flex-1'>
        <h2 className='text-2xl font-bold mb-6'>Resumo</h2>

        <div className='space-y-3 mb-4'>
          <div className='flex justify-between text-base'>
            <span className='text-gray-600'>Subtotal:</span>
            <span className='font-medium'>{formatToCurrency(subtotal)}</span>
          </div>

          <div className='flex justify-between text-base'>
            <span className='text-gray-600'>Frete:</span>
            <span className='font-medium'>{formatToCurrency(shipping)}</span>
          </div>

          <div className='flex justify-between text-base'>
            <span className='text-gray-600'>Descontos:</span>
            <span className='font-medium'>{formatToCurrency(discount)}</span>
          </div>
        </div>

        <div className='border-t pt-4 mt-4 mb-8'>
          <div className='flex justify-between text-xl'>
            <span className='font-bold'>Total</span>
            <span className='font-bold'>{formatToCurrency(total)}</span>
          </div>
        </div>

        <div className='relative flex items-center mb-8'>
          <Input
            id='promoCode'
            type='text'
            placeholder='Código promocional'
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            className='flex-1 h-12 text-base'
          />
          <Button
            onClick={handleApplyPromoCode}
            variant='secondary'
            className='absolute text-white bg-[#17A17F] right-2 font-semibold tracking-wide'
          >
            APLICAR
          </Button>
        </div>
      </div>

      <Button
        type='submit'
        onClick={handleFinalize}
        disabled={cart.products.length <= 0}
        className='w-full h-12 py-4 px-10 bg-[#13425C] hover:bg-[#13425C]/90 font-bold text-white text-lg rounded-lg shadow-lg transition-all hover:shadow-xl tracking-wide'
      >
        FINALIZAR COMPRA
      </Button>
    </div>
  );
}
