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
import { useLoading } from '@/hooks/use_loading';
import { fetchUser, updateUser, changeEmail } from '@/services/auth_service';
import type { UpdateUserRequest } from '@/services/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import z from 'zod';

const formSchema = z.object({
  name: z.string().min(1, {
    error: 'Por favor, insira um nome válido',
  }),
  email: z.email({
    error: 'Por favor, insira um email válido',
  }),
  phone: z.string().min(1, {
    error: 'Por favor, insira um celular válido',
  }),
});

export function MyAccount() {
  const queryClient = useQueryClient();

  const { data: user, fetchStatus } = useQuery({
    queryKey: ['user'],
    queryFn: async () => await fetchUser(),
  });

  useLoading([fetchStatus]);

  const updateUserMutation = useMutation({
    mutationFn: async ({
      updates,
      email,
    }: {
      updates?: UpdateUserRequest;
      email?: string;
    }) => {
      const promises = [];

      if (updates && Object.keys(updates).length > 0) {
        promises.push(updateUser(updates));
      }

      if (email) {
        promises.push(changeEmail(email));
      }

      return await Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error) => {
      console.error('Erro ao atualizar usuário:', error);
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) return;

    const { dirtyFields } = form.formState;
    const updates: UpdateUserRequest = {};
    let newEmail: string | undefined;

    if (dirtyFields.name && values.name !== user.name) {
      updates.name = values.name;
    }

    if (dirtyFields.phone && values.phone !== user.phone) {
      updates.phone = values.phone;
    }

    if (dirtyFields.email && values.email !== user.email) {
      newEmail = values.email;
    }

    if (Object.keys(updates).length === 0 && !newEmail) return;

    updateUserMutation.mutate({
      updates: updates,
      email: newEmail,
    });
  }

  return (
    <div className='min-h-screen flex flex-col px-6 py-10'>
      <div className='flex flex-col items-center px-6'>
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
                name='phone'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Celular</FormLabel>
                    <FormControl>
                      <Input
                        type='tel'
                        placeholder='(51) 9 9999-9999'
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          let formatted = value;

                          if (value.length > 0) {
                            formatted = `(${value.substring(0, 2)}`;
                          }
                          if (value.length >= 3) {
                            formatted += `) ${value.substring(2, 3)}`;
                          }
                          if (value.length >= 4) {
                            formatted += ` ${value.substring(3, 7)}`;
                          }
                          if (value.length >= 8) {
                            formatted += `-${value.substring(7, 11)}`;
                          }

                          field.onChange(formatted);
                        }}
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
                SALVAR
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
