import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { routes } from './routes/routes';
import { queryClient } from './utils/query_client';
import { QueryClientProvider } from '@tanstack/react-query';

import './index.css';

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={routes} />
  </QueryClientProvider>
);
