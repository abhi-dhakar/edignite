
import { Inter } from "next/font/google"
import { Sidebar } from "@/components/sidebar"
import "../globals.css";
const inter = Inter({ subsets: ["latin"] })
import { Toaster } from "sonner"
export const metadata = {
  title: "Admin Panel",
  description: "Secure admin dashboard for managing your NGO",
}


export default function AdminLayout({ children }) {
  return (
    
      <div className="flex min-h-screen bg-muted ml-64">
          <Sidebar />
          <div className="flex flex-col w-full">
            <main className="flex-1 p-6 overflow-y-auto">{children}</main>
               <Toaster />
          </div>
        </div>
      
  )
}