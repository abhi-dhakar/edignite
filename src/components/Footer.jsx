'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black bg-opacity-70 text-gray-300 py-6 text-center">
      <div className="space-x-4">
        <Link href="/about" className="hover:text-orange-400">About</Link>
        <Link href="/work" className="hover:text-orange-400">Work</Link>
        <Link href="/contact" className="hover:text-orange-400">Contact</Link>
        <Link href="/events" className="hover:text-orange-400">Events</Link>
      </div>
      <p className="mt-2 text-sm">&copy; 2025 Edignite NGO. All rights reserved.</p>
    </footer>
  );
}
