import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Layout from "@/components/Layout";
import SessionProviderWrapper from "../providers/SessionProviderWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Edignite | Empowering Lives",
  description:
    "NGO focused on education, healthcare, women empowerment, and environmental sustainability.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}
      >
        <SessionProviderWrapper>
          <Layout>{children}</Layout>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
