'use client';

import Link from 'next/link';

export function Header() {
  return (
    <header className="bg-[#043933] text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-center items-center">
        <Link href="/" className="text-xl font-bold">
          Donation Platform
        </Link>
      </div>
    </header>
  );
}
