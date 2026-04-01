import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import NavbarAdmin from "@/components/layout/NavbarAdmin";
import Footer from "@/components/layout/Footer";
import SidebarAdmin from "@/components/layout/sideBarAdmin";

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
    <html lang="fr">
      <body className={`${inter.className} antialiased`}>
        <div className="flex flex-col min-h-screen">
          <NavbarAdmin/>
          <div style={{ display: "flex", flex: 1 }}>
            <SidebarAdmin/>
            <main className="flex-grow">{children}</main>
          </div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
