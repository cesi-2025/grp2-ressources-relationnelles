import type { Metadata } from "next";
import "../globals.css";
import NavbarAdmin from "@/components/layout/NavbarAdmin";
import Footer from "@/components/layout/Footer";
import SidebarAdmin from "@/components/layout/sideBarAdmin";
import { AdminPage } from "@/components/layout/ProtectedPage";



export const metadata: Metadata = {
  title: "(RE)Mode Admin",
  description: "Platforme d'administration permettant l'acces au modifications test",
  keywords: ["admin", "modération", "modification", "bannissement"],
};

export default function AdminLayout({
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
