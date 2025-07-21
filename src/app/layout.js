import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import SessionProviderWrapper from "./providers/SessionProviderWrapper";
import { NotificationProvider } from "@/contexts/NotificationContext";
// import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Edignite NGO",
  description:
    "NGO focused on education, healthcare, women empowerment, and environmental sustainability.",
  icons: {
    icon: "/images.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        <SessionProviderWrapper>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
