// Navbar.jsx
import React, { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

import {
  User,
  LogOut,
  Settings,
  Heart,
  Menu,
  ChevronDown,
  UserCircle,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const isAdmin = session?.user?.memberType === "Admin";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Mobile Layout - 3 sections: hamburger menu, centered logo, profile */}
        <div className="md:hidden w-full mx-4 flex items-center justify-between">
          {/* Left Hamburger Menu */}
          <div className="flex items-center gap-2">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Menu className="h-6 w-6" />
              </SheetTrigger>

              <SheetContent side="left" className="w-[75%] sm:w-[350px] p-0">
                <div className="flex flex-col h-full overflow-y-auto px-4 pb-6">
                  {/* Header */}
                  <div className="flex items-center justify-between py-4">
                    <Link
                      href="/"
                      className="flex items-center gap-2"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="h-10 w-10 rounded-full flex items-center justify-center">
                        <img src="/images.png" alt="logo" />
                      </div>
                      <span className="font-bold text-xl text-myColorAB">
                        Edignite NGO
                      </span>
                    </Link>
                    
                  </div>

                  {/* Scrollable Navigation */}
                  <nav className="flex flex-col gap-4 mt-4">

                     <Button
                      className="w-full bg-myColorA"
                      size="lg"
                      onClick={() => setIsOpen(false)}
                    >
                      Donate Now
                    </Button>
                    
                    <div className="border-b pb-4">
                      <div className="font-medium mb-2">About Us</div>
                      <div className="pl-4 flex flex-col gap-1">
                        <Link
                          href="/about"
                          onClick={() => setIsOpen(false)}
                          className="py-1 hover:text-primary"
                        >
                          Our Mission
                        </Link>
                        <Link
                          href="/about"
                          onClick={() => setIsOpen(false)}
                          className="py-1 hover:text-primary"
                        >
                          Our Team
                        </Link>
                        <Link
                          href="/contact"
                          onClick={() => setIsOpen(false)}
                          className="py-1 hover:text-primary"
                        >
                          Contuct Us
                        </Link>
                      </div>
                    </div>

                    <div className="border-b pb-4">
                      <div className="font-medium mb-2">Our Work</div>
                      <div className="pl-4 flex flex-col gap-1">
                        <Link
                          href="/our-work"
                          onClick={() => setIsOpen(false)}
                          className="py-1 hover:text-primary"
                        >
                          our-works
                        </Link>
                        <Link
                          href="/our-impacts"
                          onClick={() => setIsOpen(false)}
                          className="py-1 hover:text-primary"
                        >
                          Our Impact
                        </Link>
                        <Link
                          href="/where-we-works"
                          onClick={() => setIsOpen(false)}
                          className="py-1 hover:text-primary"
                        >
                          Where We Work
                        </Link>
                      </div>
                    </div>

                    <div className="border-b pb-4">
                      <div className="font-medium mb-2">Events</div>
                      <div className="pl-4 flex flex-col gap-1">
                        <Link
                          href="/events"
                          onClick={() => setIsOpen(false)}
                          className="py-1 hover:text-primary"
                        >
                          Upcoming Events
                        </Link>
                        <Link
                          href="/events"
                          onClick={() => setIsOpen(false)}
                          className="py-1 hover:text-primary"
                        >
                          Past Events
                        </Link>
                       
                      </div>
                    </div>

                    <div className="border-b pb-4">
                      <div className="font-medium mb-2">Media</div>
                      <div className="pl-4 flex flex-col gap-1">
                       
                        <Link
                          href="/blogs"
                          onClick={() => setIsOpen(false)}
                          className="py-1 hover:text-primary"
                        >
                          blogs
                        </Link>
                        <Link
                          href="/mediagallery"
                          onClick={() => setIsOpen(false)}
                          className="py-1 hover:text-primary"
                        >
                          Gallery
                        </Link>
                      </div>
                    </div>

                    <Link
                      href="/success-stories"
                      onClick={() => setIsOpen(false)}
                      className="py-2 font-medium border-b pb-4"
                    >
                      Success Stories
                    </Link>

                    <div className="border-b pb-4">
                      <div className="font-medium mb-2">Get Involved</div>
                      <div className="pl-4 flex flex-col gap-1">
                        <Link
                          href="/volunteer"
                          onClick={() => setIsOpen(false)}
                          className="py-1 hover:text-primary"
                        >
                         Become a Volunteer
                        </Link>

                        <Link
                          href="/volunteer"
                          onClick={() => setIsOpen(false)}
                          className="py-1 hover:text-primary"
                        >
                          Partner With Us
                        </Link>
                      </div>
                    </div>

                    <Link
                      href="/sponsorship"
                      onClick={() => setIsOpen(false)}
                      className="py-2 font-medium border-b pb-4"
                    >
                      Sponsorship
                    </Link>

                   

                  </nav>
                </div>
              </SheetContent>
            </Sheet>
            <NotificationBell />
          </div>

          {/* Center Logo */}
          <div className="absolute left-1/2 flex justify-center items-center transform -translate-x-1/2">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full  flex items-center justify-center">
                <img src="/images.png" alt="logo" />
              </div>
               <div className="flex flex-col">
                <span className="font-bold text-xl text-myColorAB hover:text-myColorA">
                Edignite NGO
              </span>
              <span className="font-light text-xs text-black">
                hope for others
              </span>
              </div>
            </Link>
          </div>

          {/* Right Profile or Auth */}
          <div>
            {!session ? (
              <Link href="/signin">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={session.user?.image || ""}
                        alt={session.user?.name || "User"}
                      />
                      <AvatarFallback>
                        {session.user?.name?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {session.user?.name && (
                        <p className="font-medium">{session.user.name}</p>
                      )}
                      {session.user?.email && (
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {session.user.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <Link href="/profile">
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Heart className="mr-2 h-4 w-4" />
                    <span>My Donations</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span
                      onClick={() => {
                        signOut();
                        setIsOpen(false);
                      }}
                    >
                      Log out
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden px-2 md:flex md:flex-1 md:justify-between md:items-center">
          {/* Logo and NGO Name */}
          <div className="mr-4 flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-12 w-12 rounded-full flex items-center justify-center">
                <img src="/images.png" alt="logo" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl text-myColorAB hover:text-myColorA">
                Edignite NGO
              </span>
              <span className="font-light text-xs text-black">
                hope for others
              </span>
              </div>
            </Link>

            <NotificationBell />
          </div>

          {/* Desktop Navigation with Custom Dropdowns */}
          <nav className="flex-1 items-center justify-center">
            <ul className="flex space-x-1 justify-center">
              {/* About Us */}
              <li className="relative group">
                <button className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors">
                  About Us
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                <div className="absolute left-0 top-8 w-48 hidden group-hover:block bg-background border rounded-md shadow-lg mt-1 p-2 z-50">
                  <Link
                    href="/about"
                    className="block px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md"
                  >
                    Our Mission
                  </Link>
                  <Link
                    href="/about"
                    className="block px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md"
                  >
                    Our Team
                  </Link>
                  <Link
                    href="/contact"
                    className="block px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md"
                  >
                    Contact Us
                  </Link>
                </div>
              </li>

              {/* Our Work */}
              <li className="relative group">
                <button className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors">
                  Our Work
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                <div className="absolute left-0 top-8 w-48 hidden group-hover:block bg-background border rounded-md shadow-lg mt-1 p-2 z-50">
                  <Link
                    href="/our-work"
                    className="block px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md"
                  >
                    Programs
                  </Link>
                  <Link
                    href="/our-impacts"
                    className="block px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md"
                  >
                    Our Impact
                  </Link>
                  <Link
                    href="/where-we-works"
                    className="block px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md"
                  >
                    Where We Work
                  </Link>
                </div>
              </li>

              {/* Events */}
              <li className="relative group">
                <button className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors">
                  Events
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                <div className="absolute left-0 top-8 w-48 hidden group-hover:block bg-background border rounded-md shadow-lg mt-1 p-2 z-50">
                  <Link
                    href="/events"
                    className="block px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md"
                  >
                    Upcoming Events
                  </Link>
                  <Link
                    href="/events"
                    className="block px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md"
                  >
                    Past Events
                  </Link>
                </div>
              </li>

              {/* Media */}
              <li className="relative group">
                <button className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors">
                  Media
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                <div className="absolute left-0 top-8 w-48 hidden group-hover:block bg-background border rounded-md shadow-lg mt-1 p-2 z-50">
                  
                  <Link
                    href="/mediagallery"
                    className="block px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md"
                  >
                    Gallery
                  </Link>
                  <Link
                    href="/blogs"
                    className="block px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md"
                  >
                    Blogs
                  </Link>
                </div>
              </li>

               {/* Get Involved */}
              <li className="relative group">
                <button className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors">
                  Get Involved
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                <div className="absolute left-0 top-8 w-48 hidden group-hover:block bg-background border rounded-md shadow-lg mt-1 p-2 z-50">
                  <Link
                    href="/volunteer"
                    className="block px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md"
                  >
                    Become a Volunteer
                  </Link>
                  <Link
                    href="/donate"
                    className="block px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md"
                  >
                    Donate
                  </Link>
                  <Link
                    href="/volunteer"
                    className="block px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md"
                  >
                    Partner With Us
                  </Link>
                </div>
              </li>

              {/* Success Stories */}
              <li>
                <Link
                  href="/success-stories"
                  className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  Success Stories
                </Link>
              </li>

            </ul>
          </nav>

          {/* Right side buttons for desktop */}
          <div className="flex items-center gap-2">
           
            {/* Donate Button - Always visible */}
            <Button
              className="hidden sm:inline-flex bg-gradient-to-r from-myColorA to-myColorAB text-white font-semibold rounded-full shadow-md hover:scale-105 transition-transform duration-200 hover:from-myColorAB hover:to-myColorA"
              size="sm"
            >
              Donate Now
            </Button>

            {/* Authentication UI */}
            {!session ? (
              <div className="flex items-center gap-2">
                <Link href="/signin">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="secondary" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={session.user?.image || ""}
                        alt={session.user?.name || "User"}
                      />
                      <AvatarFallback>
                        {session.user?.name?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {session.user?.name && (
                        <p className="font-medium">{session.user.name}</p>
                      )}
                      {session.user?.email && (
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {session.user.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                   {isAdmin && <DropdownMenuItem className="bg-emerald-100 hover:bg-emerald-200">
                    <UserCircle className="mr-2 h-4 w-4" />
                    <Link href="/admin/dashboard">
                      <span>Admin Dashboard</span>
                    </Link>
                  </DropdownMenuItem>}
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <Link href="/profile">
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Heart className="mr-2 h-4 w-4" />
                    <span>My Donations</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span
                      onClick={() => {
                        signOut();
                        setIsOpen(false);
                      }}
                    >
                      Log out
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
