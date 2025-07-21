import { Inter } from "next/font/google";
import "../globals.css";
import Layout from "@/components/Layout";

const inter = Inter({ subsets: ["latin"] });
export const metadata = {
  title: "Edignite NGO",
  description:
    "NGO focused on education, healthcare, women empowerment, and environmental sustainability.",
  icons: {
    icon: "/images.png",
  },
};

export default function HomeLayout({ children }) {
  return (
    <div>
      <Layout>{children}</Layout>
    </div>
  );
}
