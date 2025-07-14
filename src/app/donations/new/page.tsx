import { DonationForm } from '@/components/donations/DonationForm';

const NewDonationPage = () => {
  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center">New Donation</h1>
        <DonationForm />
      </div>
    </div>
  );
};

export default NewDonationPage;
