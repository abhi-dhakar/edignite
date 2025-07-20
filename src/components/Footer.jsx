'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black bg-opacity-70 text-gray-300 py-6 text-center">
      <div className="space-x-4">
        <Link href="/about" className="hover:text-myColorA">About</Link>
        <Link href="/work" className="hover:text-myColorA">Work</Link>
        <Link href="/contact" className="hover:text-myColorA">Contact</Link>
        <Link href="/events" className="hover:text-myColorA">Events</Link>
        <Link href="/mediagallery" className="hover:text-myColorA">Gallery</Link>
        <Link href="/successstories" className="hover:text-myColorA">Success Stories</Link>
      </div>
      <p className="mt-2 text-sm">&copy; 2025 Edignite NGO. All rights reserved.</p>
    </footer>
  );
}
