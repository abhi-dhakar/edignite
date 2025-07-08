'use client';

import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";

export function CustomNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { data: session } = useSession();

  const navItems = [
    { name: "About Us", link: "/about" },
    { name: "Our Work", link: "/work" },
    { name: "Get Involved", link: "/get-involved" },
    { name: "Events", link: "/events" },
    {name: "contact", link: "/contact"}
   
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Navbar className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-black/70 backdrop-blur-md' : ''}`}>

      {/* Desktop Navigation */}
      <NavBody>
        <NavbarLogo />
        <NavItems items={navItems} />
        <div className="flex items-center gap-4">
          {!session ? (
            <>
              <Link href="/signin">
                <NavbarButton variant="secondary">Sign In</NavbarButton>
              </Link>
              <Link href="/signup">
                <NavbarButton variant="primary">Sign Up</NavbarButton>
              </Link>
            </>
          ) : (
            <>
              <Link href="/profile">
                <NavbarButton variant="secondary">Profile</NavbarButton>
              </Link>
              <NavbarButton onClick={() => signOut()} variant="primary">Logout</NavbarButton>
            </>
          )}
        </div>
      </NavBody>

      {/* Mobile Navigation */}
      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
          <MobileNavToggle
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </MobileNavHeader>

        <MobileNavMenu 
          isOpen={isMobileMenuOpen} 
          onClose={() => setIsMobileMenuOpen(false)}
        >
          {navItems.map((item, idx) => (
            <Link
              key={`mobile-link-${idx}`}
              href={item.link}
              onClick={() => setIsMobileMenuOpen(false)}
              className="relative text-neutral-600 dark:text-neutral-300"
            >
              <span className="block py-2">{item.name}</span>
            </Link>
          ))}

          <div className="flex w-full flex-col gap-4 mt-4">
            {!session ? (
              <>
                <Link href="/signin">
                  <NavbarButton
                    onClick={() => setIsMobileMenuOpen(false)}
                    variant="primary"
                    className="w-full"
                  >
                    Sign In
                  </NavbarButton>
                </Link>

                <Link href="/signup">
                  <NavbarButton
                    onClick={() => setIsMobileMenuOpen(false)}
                    variant="primary"
                    className="w-full"
                  >
                    Sign Up
                  </NavbarButton>
                </Link>
              </>
            ) : (
              <>
                <Link href="/profile">
                  <NavbarButton
                    onClick={() => setIsMobileMenuOpen(false)}
                    variant="secondary"
                    className="w-full"
                  >
                    Profile
                  </NavbarButton>
                </Link>
                <NavbarButton
                  onClick={() => { setIsMobileMenuOpen(false); signOut(); }}
                  variant="primary"
                  className="w-full"
                >
                  Logout
                </NavbarButton>
              </>
            )}
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
