import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { EnvBanner } from "@/components/EnvBanner";
import { AuthProvider } from "@/lib/auth-context";
import { FilterProvider } from "@/lib/filter-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MOOD Admin",
  description: "Analytics Dashboard for MOOD Fitness App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <AuthProvider>
          <FilterProvider>
            <EnvBanner />
            <div className="flex h-[calc(100vh-40px)]">
              <Sidebar />
              <main className="flex-1 overflow-auto p-6">
                {children}
              </main>
            </div>
          </FilterProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
