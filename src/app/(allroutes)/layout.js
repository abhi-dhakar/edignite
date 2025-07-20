
import { Inter } from "next/font/google"
import "../globals.css";
import Layout from "@/components/Layout";

const inter = Inter({ subsets: ["latin"] })
export const metadata = {
  title: "Admin Panel",
  description: "Secure admin dashboard for managing your NGO",
}

export default function HomeLayout({ children }) {
  return (
    <div>
      <Layout>{children}</Layout>
    </div>
  );
}