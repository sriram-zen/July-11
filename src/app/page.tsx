import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
      <main className="flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
          Welcome to the Donation Platform
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-300">
          Your one-stop solution for managing and tracking donations efficiently.
        </p>
        <div className="mt-10">
          <Link href="/donations/new">
            <Button size="lg">Make a Donation</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
