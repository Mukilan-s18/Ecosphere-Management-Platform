import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Sidebar } from "@/components/Sidebar";
import { Toaster } from "sonner";
import { ESGOracle } from "@/components/ESGOracle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ecosphere — ESG Management Platform",
  description:
    "Enterprise sustainability gamification, governance compliance, and ESG performance management platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          disableTransitionOnChange
        >
          <Sidebar />
          <main className="flex-1 ml-64 p-8 min-h-screen overflow-y-auto">
            {children}
          </main>
          <ESGOracle />
          <Toaster richColors position="bottom-right" theme="dark" />
        </ThemeProvider>
      </body>
    </html>
  );
}
