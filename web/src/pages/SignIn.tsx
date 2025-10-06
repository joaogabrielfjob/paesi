import paesi from '../assets/paesi.svg';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useLoading } from '@/hooks/use_loading';
import { useMutation } from '@tanstack/react-query';
import { signIn, fetchToken } from '@/services/auth_service';
import type { SignInRequest } from '@/services/types';

const formSchema = z.object({
  email: z.email({
    error: 'Por favor, insira um email válido',
  }),
  password: z.string().min(1, {
    error: 'Por favor, insira uma senha válida',
  }),
});

export function SignIn() {
  const navigate = useNavigate();

  const fetchTokenMutation = useMutation({
    mutationFn: async () => {
      return await fetchToken();
    },
    onSuccess: ({ data }) => {
      localStorage.setItem('token', data.token);

      navigate('/');
    },
    onError: (error) => {
      console.error('Failed to fetch token:', error);
    },
  });

  const signInMutation = useMutation({
    mutationFn: (request: SignInRequest) => {
      return signIn(request);
    },
    onSuccess: () => {
      fetchTokenMutation.mutate();
    },
    onError: (error) => {
      console.error('Sign in failed:', error);
    },
  });

  useLoading([
    signInMutation.isPending ? 'fetching' : 'idle',
    fetchTokenMutation.isPending ? 'fetching' : 'idle',
  ]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    signInMutation.mutate({
      email: values.email,
      password: values.password,
    });
  }

  return (
    <div className='min-h-screen flex flex-col px-6 py-6'>
      <div className='flex flex-col items-center mt-[120px]'>
        <img src={paesi} className='max-w-full h-auto' alt='Paesi Logo' />
      </div>

      <div className='flex flex-col items-center mt-[72px] px-6'>
        <div className='w-full max-w-sm'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type='email'
                        placeholder='seu@email.com'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input
                        type='password'
                        placeholder='••••••••'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type='submit'
                className='w-full py-4 px-10 bg-[#13425C] hover:bg-[#13425C]/90 font-bold text-white text-lg rounded-lg shadow-lg transition-all hover:shadow-xl'
              >
                ENTRAR
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
