import "./globals.css"
import { Inter } from "next/font/google"
import { Sidebar } from "@/components/Sidebar"
import { ESGOracle } from "@/components/ESGOracle"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "EcoSphere Management Platform",
  description: "ESG Management Platform with AI-powered policy assistant",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-950 text-white flex`}>
        <Sidebar />
        <main className="flex-1 ml-64 p-8">
          {children}
        </main>
        <ESGOracle />
        <Toaster theme="dark" />
      </body>
    </html>
  )
}
