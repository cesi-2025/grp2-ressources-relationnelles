import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import NavbarAdmin from "@/components/layout/NavbarAdmin";
import Footer from "@/components/layout/Footer";
import SidebarAdmin from "@/components/layout/sideBarAdmin";
import { AuthProvider } from "@/context/AuthContext";
import { AdminPage } from "@/components/layout/ProtectedPage";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});


export const metadata: Metadata = {
  title: "(RE)Mode Admin",
  description: "Platforme d'administration permettant l'acces au modifications",
  keywords: ["admin", "modération", "modification", "bannissement"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <div className="flex flex-col min-h-screen">
        <NavbarAdmin/>
        <div style={{ display: "flex", flex: 1 }}>
          <SidebarAdmin/>
          <main className="flex-grow"><AdminPage>{children}</AdminPage></main>
        </div>
        <Footer />
      </div>
  );
}
