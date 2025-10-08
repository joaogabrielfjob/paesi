import sabao from '../assets/sabão-v2.webp';

import { CartProductCard } from '@/components/CartProductCard';
import { Button } from '@/components/ui/button';
import type { StoredCart } from '@/services/types';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function Cart() {
  const navigate = useNavigate();

  const formatToCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const [cart, setCart] = useState<StoredCart>({ products: [] });

  useEffect(() => {
    const storedCart = localStorage.getItem('order');
    if (storedCart) setCart(JSON.parse(storedCart));
  }, []);

  const total = cart.products.reduce(
    (total, cp) => total + cp.quantity * cp.product.price,
    0
  );

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    setCart((prevCart) => {
      const products = prevCart.products
        .map((cartProduct) => {
          if (cartProduct.product.id === productId) {
            return {
              ...cartProduct,
              quantity: newQuantity
            };
          }
          return cartProduct;
        })
        .filter((cartProduct) => cartProduct.quantity > 0);

      const updatedCart = { products };

      localStorage.setItem('order', JSON.stringify(updatedCart));

      return updatedCart;
    });
  };

  const handleCheckout = () => {
    navigate('/finalizar-compra');
  };

  return (
    <div className='min-h-screen flex flex-col px-6 py-6'>
      <div className='w-full grid grid-cols-1 gap-1 sm:gap-4 mt-[40px]'>
        {cart.products.length > 0 &&
          cart.products.map((cp) => (
            <CartProductCard
              key={cp.product.id}
              cartProduct={cp}
              image={sabao}
              onQuantityChange={handleQuantityChange}
            />
          ))}
      </div>

      <div className='fixed bottom-0 left-0 w-full bg-white shadow-lg p-4 flex justify-between items-center rounded-t-2xl'>
        <div>
          <p className='text-gray-600 text-sm'>Total</p>
          <p className='text-xl font-bold'>{formatToCurrency(total)}</p>
        </div>
        <Button
          size='lg'
          disabled={cart.products.length <= 0}
          onClick={handleCheckout}
          className='bg-[#17A17F] text-white font-bold text-sm rounded-md tracking-[.025em]'
        >
          FINALIZAR
        </Button>
      </div>
    </div>
  );
}
