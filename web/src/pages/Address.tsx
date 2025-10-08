import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useLoading } from '@/hooks/use_loading';
import { fetchAddress, upsertAddress } from '@/services/address_service';
import { fetchPostalCode } from '@/services/postal_code_service';
import type { UpsertAddressRequest } from '@/services/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import z from 'zod';

const formSchema = z.object({
  postalCode: z.string().min(8, {
    message: 'Por favor, insira um CEP válido'
  }),
  country: z.string().min(1, {
    message: 'Por favor, insira um país válido'
  }),
  state: z.string().min(2, {
    message: 'Por favor, insira um estado válido'
  }),
  city: z.string().min(1, {
    message: 'Por favor, insira uma cidade válida'
  }),
  street: z.string().min(1, {
    message: 'Por favor, insira uma rua válida'
  }),
  neighborhood: z.string().min(1, {
    message: 'Por favor, insira um bairro válido'
  }),
  number: z.string().min(1, {
    message: 'Por favor, insira um número válido'
  }),
  complement: z.string().optional()
});

export function Address() {
  const queryClient = useQueryClient();
  const [isLoadingCep, setIsLoadingCep] = useState(false);

  const { data: response, fetchStatus } = useQuery({
    queryKey: ['address'],
    queryFn: async () => await fetchAddress()
  });

  useLoading([fetchStatus]);

  const upsertAddressMutation = useMutation({
    mutationFn: async (request: UpsertAddressRequest) => {
      return await upsertAddress(request);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['address'] });
    },
    onError: (error) => {
      console.error('Erro ao salvar endereço:', error);
    }
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      postalCode: '',
      country: '',
      state: '',
      city: '',
      street: '',
      neighborhood: '',
      number: '',
      complement: ''
    }
  });

  useEffect(() => {
    if (response) {
      form.reset({
        postalCode: response.address?.postalCode || '',
        country: response.address?.country || '',
        state: response.address?.state || '',
        city: response.address?.city || '',
        street: response.address?.street || '',
        neighborhood: response.address?.neighborhood || '',
        number: response.address?.number || '',
        complement: response.address?.complement || ''
      });
    }
  }, [response, form]);

  async function handleCepBlur(cep: string) {
    const cleanCep = cep.replace(/\D/g, '');

    if (cleanCep.length !== 8) return;

    setIsLoadingCep(true);

    try {
      const cepData = await fetchPostalCode(cleanCep);

      form.setValue('country', 'Brasil');
      form.setValue('state', cepData.state);
      form.setValue('city', cepData.city);
      form.setValue('neighborhood', cepData.neighborhood);
      form.setValue('street', cepData.street);
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
    } finally {
      setIsLoadingCep(false);
    }
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    upsertAddressMutation.mutate(values);
  }

  return (
    <div className='min-h-screen flex flex-col px-6 py-10'>
      <div className='flex flex-col items-center px-6'>
        <div className='w-full max-w-sm'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <FormField
                control={form.control}
                name='postalCode'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CEP</FormLabel>
                    <FormControl>
                      <Input
                        type='text'
                        placeholder='00000-000'
                        disabled={isLoadingCep}
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          let formatted = value;

                          if (value.length > 5) {
                            formatted = `${value.substring(0, 5)}-${value.substring(5, 8)}`;
                          }

                          field.onChange(formatted);
                        }}
                        onBlur={(e) => {
                          field.onBlur();
                          handleCepBlur(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='country'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>País</FormLabel>
                    <FormControl>
                      <Input
                        type='text'
                        placeholder='Brasil'
                        disabled={isLoadingCep}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='state'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <FormControl>
                      <Input
                        type='text'
                        placeholder='RS'
                        disabled={isLoadingCep}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='city'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade</FormLabel>
                    <FormControl>
                      <Input
                        type='text'
                        placeholder='Porto Alegre'
                        disabled={isLoadingCep}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='neighborhood'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bairro</FormLabel>
                    <FormControl>
                      <Input
                        type='text'
                        placeholder='Centro'
                        disabled={isLoadingCep}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='street'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rua</FormLabel>
                    <FormControl>
                      <Input
                        type='text'
                        placeholder='Rua das Flores'
                        disabled={isLoadingCep}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='number'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número</FormLabel>
                    <FormControl>
                      <Input type='text' placeholder='123' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='complement'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Complemento (Opcional)</FormLabel>
                    <FormControl>
                      <Input
                        type='text'
                        placeholder='Apartamento 101'
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
                SALVAR
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
