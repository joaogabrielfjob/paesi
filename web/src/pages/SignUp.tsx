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
import { fetchToken, signUp } from '@/services/auth_service';
import type { AuthResponse, SignUpRequest } from '@/services/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import z from 'zod';

const formSchema = z.object({
  name: z.string().min(1, {
    error: 'Por favor, insira um nome válido',
  }),
  email: z.email({
    error: 'Por favor, insira um email válido',
  }),
  password: z.string().min(1, {
    error: 'Por favor, insira uma senha válida',
  }),
});

export function SignUp() {
  const navigate = useNavigate();

  const fetchTokenMutation = useMutation({
    mutationFn: async () => {
      return await fetchToken();
    },
    onSuccess: (data) => {
      if (data && typeof data === 'object' && 'token' in data) {
        const response = data as AuthResponse;
        localStorage.setItem('token', response.token);

        navigate('/');
      }
    },
    onError: (error) => {
      console.error('Failed to fetch token:', error);
    },
  });

  const signUpMutation = useMutation({
    mutationFn: async (request: SignUpRequest) => {
      return await signUp(request);
    },
    onSuccess: () => {
      fetchTokenMutation.mutate();
    },
    onError: (error) => {
      console.error('Sign in failed:', error);
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    signUpMutation.mutate({
      name: values.name,
      email: values.email,
      password: values.password,
    });
  }

  return (
    <div className='min-h-screen flex flex-col px-6 py-10'>
      <div className='flex flex-col items-center mt-[120px]'>
        <img src={paesi} className='max-w-full h-auto' alt='Paesi Logo' />
      </div>

      <div className='flex flex-col items-center mt-[72px] px-6'>
        <div className='w-full max-w-sm'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input
                        type='name'
                        placeholder='Nome completo'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                CRIAR CONTA
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
