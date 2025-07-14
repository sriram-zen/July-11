export enum PaymentType {
  CASH = 'CASH',
  CHEQUE = 'CHEQUE',
  ONLINE = 'ONLINE',
  UPI = 'UPI',
}

export type DonationFormData = {
  amount: number;
  donor_name: string;
  donor_email: string;
  donor_phone?: string;
  payment_type: PaymentType;
  cheque_number?: string;
  transaction_id?: string;
};
