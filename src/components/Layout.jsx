'use client';


import Footer from './Footer';
import { CustomNavbar } from './MyNavbar';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-black text-white">
      <CustomNavbar/>

      <main className="flex-grow px-4 md:px-12 py-8">
        {children}
      </main>

      <Footer />
    </div>
  );
}