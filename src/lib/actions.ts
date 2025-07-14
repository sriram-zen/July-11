'use server';

import { z } from 'zod';
import { supabase } from './supabase';
import { DonationFormData, PaymentType } from './types';

const formSchema = z.object({
  amount: z.coerce.number().positive('Amount must be positive'),
  donor_name: z.string().min(1, 'Donor name is required'),
  donor_email: z.string().email('Invalid email address'),
  donor_phone: z.string().regex(/^\d{10}$/, 'Invalid phone number').optional().or(z.literal('')),
  payment_type: z.nativeEnum(PaymentType),
  cheque_number: z.string().optional(),
  transaction_id: z.string().optional(),
});

export async function createDonation(formData: DonationFormData) {
  const validatedFields = formSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { amount, donor_name, donor_email, donor_phone, payment_type, cheque_number, transaction_id } = validatedFields.data;

  // Upsert donor
  const { data: donorData, error: donorError } = await supabase
    .from('donors')
    .upsert({ name: donor_name, email: donor_email, phone: donor_phone }, { onConflict: 'email' })
    .select('id')
    .single();

  if (donorError) {
    console.error('Error upserting donor:', donorError);
    return { message: 'Error creating donor' };
  }

  // Insert donation
  const { error: donationError } = await supabase.from('donations').insert({
    amount,
    donor_id: donorData.id,
    payment_type,
    cheque_number,
    transaction_id,
  });

  if (donationError) {
    console.error('Error inserting donation:', donationError);
    return { message: 'Error creating donation' };
  }

  return { message: 'Donation created successfully' };
}
