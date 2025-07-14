'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { PaymentType } from '@/lib/types';
import { createDonation } from '@/lib/actions';

const formSchema = z
  .object({
    amount: z.coerce.number().positive('Amount must be positive'),
    donor_name: z.string().min(1, 'Donor name is required'),
    donor_email: z.string().email('Invalid email address'),
    donor_phone: z.string().regex(/^\d{10}$/, 'Invalid phone number').optional().or(z.literal('')),
    payment_type: z.nativeEnum(PaymentType),
    cheque_number: z.string().optional(),
    transaction_id: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.payment_type === PaymentType.CHEQUE) {
        return !!data.cheque_number;
      }
      return true;
    },
    {
      message: 'Cheque number is required',
      path: ['cheque_number'],
    }
  )
  .refine(
    (data) => {
      if (
        data.payment_type === PaymentType.ONLINE ||
        data.payment_type === PaymentType.UPI
      ) {
        return !!data.transaction_id;
      }
      return true;
    },
    {
      message: 'Transaction ID is required',
      path: ['transaction_id'],
    }
  );

export function DonationForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      donor_name: '',
      donor_email: '',
      donor_phone: '',
      payment_type: PaymentType.CASH,
    },
  });

  const paymentType = form.watch('payment_type');

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const result = await createDonation(values);
    if (result?.errors) {
      // Handle errors
    } else {
      // Handle success
      form.reset();
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="donor_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Donor Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter donor name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="donor_email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Donor Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter donor email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="donor_phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Donor Phone (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Enter donor phone" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="payment_type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Payment Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value={PaymentType.CASH} />
                    </FormControl>
                    <FormLabel className="font-normal">Cash</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value={PaymentType.CHEQUE} />
                    </FormControl>
                    <FormLabel className="font-normal">Cheque</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value={PaymentType.ONLINE} />
                    </FormControl>
                    <FormLabel className="font-normal">Online</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value={PaymentType.UPI} />
                    </FormControl>
                    <FormLabel className="font-normal">UPI</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {paymentType === PaymentType.CHEQUE && (
          <FormField
            control={form.control}
            name="cheque_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cheque Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter cheque number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {(paymentType === PaymentType.ONLINE || paymentType === PaymentType.UPI) && (
          <FormField
            control={form.control}
            name="transaction_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Transaction ID</FormLabel>
                <FormControl>
                  <Input placeholder="Enter transaction ID" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
