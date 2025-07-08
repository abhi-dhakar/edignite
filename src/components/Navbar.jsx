"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About Us", path: "/about" },
  { name: "Our Work", path: "/work" },
  { name: "Get Involved", path: "/get-involved" },
  { name: "Events & Media", path: "/events" },
  { name: "Contact", path: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center justify-between p-4 shadow-md bg-black bg-opacity-50 backdrop-blur-md sticky top-0 z-50">
      <Link
        href="/"
        className="text-2xl font-bold text-white hover:text-orange-400"
      >
        Edignite
      </Link>

      <div className="hidden md:flex space-x-6">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            href={link.path}
            className={`hover:text-orange-400 transition-colors ${pathname === link.path ? "text-orange-400 font-semibold" : "text-white"}`}
          >
            {link.name}
          </Link>
        ))}
      </div>

      <div className="flex items-center space-x-4">
        <Link
          href="/donate"
          className="px-4 py-2 bg-orange-500 rounded-full hover:bg-orange-600 text-sm font-medium"
        >
          Donate Now
        </Link>
        <Link href="/profile">
          <div className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center font-semibold">
            U
          </div>
        </Link>
      </div>
    </nav>
  );
}
