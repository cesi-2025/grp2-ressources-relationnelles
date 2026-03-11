import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import NavbarAdmin from "@/components/layout/NavbarAdmin";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const logged = true;

export const metadata: Metadata = {
  title: "(RE)Sources Relationnelles",
  description: "Plateforme de ressources pour l'amélioration des relations entre citoyens",
  keywords: ["ressources", "relations", "citoyens", "développement personnel"],
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
          {!logged ? (<Navbar />):(<NavbarAdmin/>)}
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
