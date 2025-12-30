// Navbar.jsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  LogOut,
  Settings,
  Heart,
  Menu,
  X,
  ChevronDown,
  UserCircle,
  Home,
  Info,
  Briefcase,
  Calendar,
  Image as ImageIcon,
  Trophy,
  HelpingHand,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import NotificationBell from "./NotificationBell";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "About Us",
    icon: Info,
    children: [
      { label: "Our Mission", href: "/about", description: "Learn about our vision and core values." },
      { label: "Our Team", href: "/about", description: "Meet the passionate people behind Edignite." },
      { label: "Contact Us", href: "/contact", description: "Get in touch with us for any queries." },
    ],
  },
  {
    label: "Our Work",
    icon: Briefcase,
    children: [
      { label: "Programs", href: "/our-work", description: "Explore our various social initiatives." },
      { label: "Our Impact", href: "/our-impacts", description: "See the real-world change we've made." },
      { label: "Where We Work", href: "/where-we-works", description: "Our operational areas and reach." },
    ],
  },
  {
    label: "Events",
    icon: Calendar,
    children: [
      { label: "Upcoming Events", href: "/events", description: "Join our upcoming community gatherings." },
      { label: "Past Events", href: "/events", description: "Relive highlights from our previous events." },
    ],
  },
  {
    label: "Media",
    icon: ImageIcon,
    children: [
      { label: "Gallery", href: "/mediagallery", description: "Visual journey of our mission." },
      { label: "Blogs", href: "/blogs", description: "Updates, stories, and news from the field." },
    ],
  },
  {
    label: "Get Involved",
    icon: HelpingHand,
    children: [
      { label: "Become a Volunteer", href: "/volunteer", description: "Dedicate your time for a cause." },
      { label: "Donate", href: "/donate", description: "Support us financially to grow our reach." },
      { label: "Partner With Us", href: "/volunteer", description: "Collaborate for a larger social impact." },
    ],
  },
];

export default function Navbar() {
  const { data: session } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedItem, setExpandedItem] = useState(null);
  const pathname = usePathname();
  const isAdmin = session?.user?.memberType === "Admin";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const ListItem = React.forwardRef(({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <Link
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-lg p-4 leading-none no-underline outline-none transition-all hover:bg-myColorA/5 hover:text-myColorA focus:bg-accent focus:text-accent-foreground group",
              className
            )}
            {...props}
          >
            <div className="text-sm font-bold leading-none mb-1 group-hover:translate-x-1 transition-transform">{title}</div>
            <p className="line-clamp-2 text-xs leading-snug text-muted-foreground opacity-80 group-hover:opacity-100 italic">
              {children}
            </p>
          </Link>
        </NavigationMenuLink>
      </li>
    );
  });
  ListItem.displayName = "ListItem";

  return (
    <header className="sticky top-0 z-50 w-full">
      <motion.div
        initial={false}
        animate={{
          paddingTop: isScrolled ? "2px" : "8px",
          paddingBottom: isScrolled ? "2px" : "8px",
        }}
        className={cn(
          "w-full transition-all duration-300 border-b bg-white/95 backdrop-blur-2xl",
          isScrolled ? "shadow-lg shadow-myColorA/5 border-myColorA/10" : "shadow-sm border-gray-100"
        )}
      >
        <div className="px-4 md:px-8 h-14 md:h-16 flex items-center justify-between relative">

          {/* Brand Group */}
          <Link href="/" className="flex items-center gap-2 md:gap-3 transition-all hover:scale-105 group shrink-0">
            <div className="h-10 w-10 md:h-11 md:w-11 rounded-xl bg-white shadow-md ring-1 ring-black/5 flex items-center justify-center p-1.5 group-hover:shadow-myColorA/20">
              <img src="/images.png" alt="logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col select-none">
              <span className="font-black text-lg md:text-xl tracking-tighter text-myColorAB group-hover:text-myColorA transition-colors">
                EDIGNITE
              </span>
              <p className="hidden sm:block text-[8px] md:text-[9px] font-bold text-myColorA uppercase tracking-[0.3em] -mt-1 opacity-70">hope for others</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center ml-4 gap-0.5">
            <NavigationMenu className="max-w-none">
              <NavigationMenuList className="gap-0">
                {navItems.map((item) => (
                  <NavigationMenuItem key={item.label}>
                    <NavigationMenuTrigger className="bg-transparent hover:bg-myColorA/5 data-[state=open]:bg-myColorA/5 font-bold text-sm tracking-tight text-gray-700">
                      {item.label}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[450px] gap-2 p-6 md:w-[550px] md:grid-cols-2 lg:w-[650px] rounded-2xl border-none">
                        {item.children.map((child) => (
                          <ListItem
                            key={child.label}
                            title={child.label}
                            href={child.href}
                          >
                            {child.description}
                          </ListItem>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ))}
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/success-stories" className={cn(navigationMenuTriggerStyle(), "bg-transparent font-bold")}>
                      Stories
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          {/* Right Section: Actions & Auth */}
          <div className="flex items-center gap-2 md:gap-4 ml-auto">

            <div className="hidden lg:flex items-center gap-4">
              <NotificationBell />
              <Link href="/donate">
                <Button
                  className="rounded-full bg-myColorA hover:bg-myColorAB text-white px-6 md:px-8 font-black shadow-lg shadow-myColorA/20 transition-all hover:scale-105 active:scale-95"
                >
                  Donate
                </Button>
              </Link>
            </div>

            {!session ? (
              <div className="flex items-center gap-2 md:gap-3">
                <Link href="/signin">
                  <Button variant="ghost" className="hidden sm:inline-flex font-bold text-sm px-4 hover:text-myColorA transition-colors">
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="rounded-full bg-secondary text-secondary-foreground font-black px-5 md:px-8 border-2 border-myColorA/5 hover:bg-secondary/80 shadow-md text-xs md:text-sm h-9 md:h-11 transition-all active:scale-95">
                    Join
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2 md:gap-4">
                <div className="lg:hidden">
                  <NotificationBell />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-10 w-10 md:h-11 md:w-11 rounded-xl p-0 overflow-hidden ring-2 ring-myColorA/10 hover:ring-myColorA/40 transition-all shadow-inner bg-myColorA/5">
                      <Avatar className="h-full w-full rounded-none">
                        <AvatarImage src={session.user?.image} />
                        <AvatarFallback className="bg-transparent text-myColorA font-black text-base md:text-lg">
                          {session.user?.name?.[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 mt-4 p-2 shadow-2xl border-myColorA/5 rounded-2xl items-center">
                    <div className="p-4 mb-2 bg-gradient-to-br from-myColorA/10 to-transparent rounded-xl flex items-center gap-3">
                      <Avatar className="h-12 w-12 border-2 border-white shadow-md">
                        <AvatarImage src={session.user?.image} />
                        <AvatarFallback>{session.user?.name?.[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <p className="text-sm font-black leading-none">{session.user.name}</p>
                        <p className="text-[10px] font-bold text-myColorA uppercase mt-1 tracking-widest">{session.user.memberType || "Ambassador"}</p>
                      </div>
                    </div>
                    <div className="px-1 py-1 space-y-1">
                      {isAdmin && (
                        <DropdownMenuItem asChild className="focus:bg-emerald-50 text-emerald-800 font-black rounded-lg py-3 cursor-pointer">
                          <Link href="/admin/dashboard" className="w-full flex items-center">
                            <UserCircle className="mr-3 h-5 w-5" />
                            Admin Dashboard
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem asChild className="font-bold rounded-lg py-3 cursor-pointer group">
                        <Link href="/profile" className="w-full flex items-center">
                          <User className="mr-3 h-5 w-5 text-gray-400 group-hover:text-myColorA transition-colors" />
                          My Profile Space
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="font-bold rounded-lg py-3 cursor-pointer group">
                        <Link href="/profile#donations" className="w-full flex items-center">
                          <Heart className="mr-3 h-5 w-5 text-red-400 group-hover:text-red-500 transition-colors" />
                          Impact History
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="font-bold rounded-lg py-3 cursor-pointer group">
                        <Link href="/profile#settings" className="w-full flex items-center">
                          <Settings className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                          Preferences
                        </Link>
                      </DropdownMenuItem>
                    </div>
                    <DropdownMenuSeparator className="mx-2 opacity-50" />
                    <div className="p-1">
                      <DropdownMenuItem
                        className="rounded-lg text-red-600 focus:bg-red-50 focus:text-red-700 cursor-pointer font-black py-3"
                        onSelect={() => signOut()}
                      >
                        <LogOut className="mr-3 h-5 w-5" />
                        Log Out
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

            {/* Mobile hamburger - Moved to right for better accessibility */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden h-10 w-10 hover:bg-myColorA/10 transition-colors">
                  <Menu className="h-6 w-6 text-myColorAB" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] p-0 flex flex-col bg-white border-none shadow-2xl">
                <div className="p-8 border-b-2 border-myColorA/5 flex flex-col items-center gap-4 bg-gradient-to-b from-myColorA/5 to-white">
                  <div className="h-20 w-20 rounded-2xl bg-white shadow-xl flex items-center justify-center p-3">
                    <img src="/images.png" alt="logo" className="w-full h-full object-contain" />
                  </div>
                  <div className="text-center">
                    <h2 className="font-black text-2xl text-myColorAB tracking-tighter">EDIGNITE</h2>
                    <p className="text-[10px] text-myColorA font-bold uppercase tracking-[0.2em] opacity-80">Empowering Humanity</p>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar">
                  <nav className="space-y-2">
                    <Link
                      href="/"
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-4 px-5 py-4 rounded-2xl text-base font-black transition-all",
                        pathname === "/" ? "bg-myColorA text-white shadow-lg shadow-myColorA/30 scale-[1.02]" : "hover:bg-myColorA/5 text-gray-700 hover:text-myColorA"
                      )}
                    >
                      <Home className="h-5 w-5" />
                      Home Dashboard
                    </Link>

                    {navItems.map((item) => (
                      <div key={item.label} className="group">
                        <button
                          onClick={() => setExpandedItem(expandedItem === item.label ? null : item.label)}
                          className={cn(
                            "w-full flex items-center justify-between px-5 py-4 rounded-2xl text-base font-black transition-all",
                            expandedItem === item.label ? "bg-myColorA/5 text-myColorA" : "text-gray-700 hover:bg-myColorA/5"
                          )}
                        >
                          <div className="flex items-center gap-4">
                            <item.icon className={cn("h-5 w-5 transition-colors", expandedItem === item.label ? "text-myColorA" : "text-gray-400")} />
                            {item.label}
                          </div>
                          <ChevronDown className={cn("h-4 w-4 transition-transform duration-300", expandedItem === item.label && "rotate-180")} />
                        </button>
                        <AnimatePresence>
                          {expandedItem === item.label && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden ml-14 mr-4 space-y-1 mt-1 border-l-2 border-myColorA/20"
                            >
                              {item.children.map((child) => (
                                <Link
                                  key={child.label}
                                  href={child.href}
                                  onClick={() => setMobileMenuOpen(false)}
                                  className="block py-3 px-4 text-sm font-bold text-gray-500 hover:text-myColorA hover:translate-x-1 transition-all"
                                >
                                  {child.label}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}

                    <Link
                      href="/success-stories"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-4 px-5 py-4 rounded-2xl text-base font-black text-gray-700 hover:bg-myColorA/5 transition-all"
                    >
                      < Trophy className="h-5 w-5 text-gray-400" />
                      Our Success Stories
                    </Link>
                  </nav>
                </div>

                <div className="p-8 border-t bg-gray-50/50">
                  <Link href="/donate" onClick={() => setMobileMenuOpen(false)} asChild>
                    <Button className="w-full bg-myColorA hover:bg-myColorAB h-14 text-lg font-black rounded-2xl shadow-2xl shadow-myColorA/40 transition-transform active:scale-95">
                      Donate Now
                    </Button>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </motion.div>
    </header>
  );
}
