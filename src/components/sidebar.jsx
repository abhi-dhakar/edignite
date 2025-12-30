// components/sidebar.jsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  HandHeart,
  Calendar,
  Image,
  Mail,
  Users,
  Newspaper,
  UserPlus,
  HeartHandshake,
  Bell,
  BookOpen,
} from "lucide-react";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/volunteers", label: "Volunteers", icon: UserPlus },
  { href: "/admin/donations", label: "Donations", icon: HandHeart },
  { href: "/admin/sponsorships", label: "Sponsorships", icon: HeartHandshake },
  { href: "/admin/events", label: "Events", icon: Calendar },
  { href: "/admin/media", label: "Media", icon: Image },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/stories", label: "Stories", icon: Newspaper },
  { href: "/admin/blogs", label: "Blogs", icon: BookOpen },
  { href: "/admin/notifications", label: "Notifications", icon: Bell },
];

export function Sidebar() {
  const path = usePathname();

  return (
    <aside className="fixed top-0 left-0 w-64 h-screen bg-white border-r p-4 z-50">
      <div className="flex items-center justify-center gap-2 mb-4">
        <img src="/images.png" alt="Logo" className="h-8 w-8 object-contain" />
        <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const isActive = path.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                ? "bg-primary text-white"
                : "text-gray-700 hover:bg-gray-100"
                }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
