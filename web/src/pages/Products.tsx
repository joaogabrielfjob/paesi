import sabao from '../assets/sabão-v2.png';

import { ProductCard } from '@/components/ProductCard';
import { CartButton } from '@/components/CartButton';
import { fetchProducts } from '@/services/product_service';
import { useLoading } from '@/hooks/use_loading';
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import type { StoredCart, ProductResponse } from '@/services/types';
import { useNavigate } from 'react-router-dom';

export function Products() {
  const navigate = useNavigate();

  const [cart, setCart] = useState<StoredCart>({ products: [] });

  useEffect(() => {
    const storedCart = localStorage.getItem('order');
    if (storedCart) setCart(JSON.parse(storedCart));
  }, []);

  const { data: products, fetchStatus } = useQuery({
    queryKey: ['products'],
    queryFn: async () => await fetchProducts(),
  });

  useLoading([fetchStatus]);

  const cartCount = cart.products.reduce(
    (total, product) => total + product.quantity,
    0,
  );

  const handleAddToCart = (product: ProductResponse) => {
    setCart((prevCart) => {
      const products = [...prevCart.products];
      const orderProduct = products.find((cp) => cp.product.id === product.id);

      if (orderProduct) {
        orderProduct.quantity += 1;
      } else {
        products.push({
          product: product,
          quantity: 1,
        });
      }

      const newOrder = { products };

      localStorage.setItem('order', JSON.stringify(newOrder));

      return newOrder;
    });
  };

  return (
    <div className='min-h-screen flex flex-col px-6 py-10 relative'>
      
      {products?.length ? (
        <div className='grid grid-cols-2 gap-3 sm:gap-4'>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              image={sabao}
              onAdd={handleAddToCart}
            />
          ))}
        </div>
      ) : (
        <p className='w-full text-gray-600 text-center'>
          Ainda não temos produtos cadastrados.
        </p>
      )}
      
      <CartButton itemCount={cartCount} onClick={() => navigate('/carrinho')} />
    </div>
  );
}
