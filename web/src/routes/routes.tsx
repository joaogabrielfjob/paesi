import { createBrowserRouter } from 'react-router-dom';
import { Auth } from '@/pages/Auth';
import { SignIn } from '@/pages/SignIn';
import { SignUp } from '@/pages/SignUp';
import { Products } from '@/pages/Products';
import { Layout } from '@/components/Layout';
import { Cart } from '@/pages/Cart';
import { Checkout } from '@/pages/Checkout';
import { Orders } from '@/pages/Orders';
import { MyAccount } from '@/pages/MyAccount';
import { Address } from '@/pages/Address';

export const routes = createBrowserRouter([
  {
    path: '/inicio',
    element: <Layout />,
    children: [
      {
        path: '/inicio',
        element: <Auth />,
        handle: {
          title: '',
          menu: false,
          back: false,
          location: '',
        },
      },
      {
        path: 'entrar',
        element: <SignIn />,
        handle: {
          title: '',
          menu: false,
          back: true,
          location: '/inicio',
        },
      },
      {
        path: 'criar-conta',
        element: <SignUp />,
        handle: {
          title: '',
          menu: false,
          back: true,
          location: '/inicio',
        },
      },
    ],
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Products />,
        handle: {
          title: 'Produtos',
          menu: true,
          back: false,
          location: '',
        },
      },
      {
        path: 'carrinho',
        element: <Cart />,
        handle: {
          title: 'Carrinho',
          menu: false,
          back: true,
          location: '/',
        },
      },
      {
        path: 'finalizar-compra',
        element: <Checkout />,
        handle: {
          title: 'Finalizar compra',
          menu: false,
          back: true,
          location: '/carrinho',
        },
      },
      {
        path: 'pedidos',
        element: <Orders />,
        handle: {
          title: 'Pedidos',
          menu: false,
          back: true,
          location: '/',
        },
      },
      {
        path: 'minha-conta',
        element: <MyAccount />,
        handle: {
          title: 'Meus dados',
          menu: false,
          back: true,
          location: '/',
        },
      },
      {
        path: 'endereco',
        element: <Address />,
        handle: {
          title: 'Endereço',
          menu: false,
          back: true,
          location: '/',
        },
      },
    ],
  },
  {
    path: '*',
    element: <Products />,
    handle: {
      title: 'Produtos',
      menu: true,
      back: false,
      location: '',
    },
  },
]);
