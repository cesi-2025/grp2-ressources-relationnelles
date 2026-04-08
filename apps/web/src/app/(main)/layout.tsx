import type { Metadata } from "next";
import "../globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AuthPage } from "@/components/layout/ProtectedPage";



export const metadata: Metadata = {
  title: "(RE)Sources Relationnelles",
  description: "Plateforme de ressources pour l'amélioration des relations entre citoyens",
  keywords: ["ressources", "relations", "citoyens", "développement personnel"],
};

export default function AdministrationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Aller au contenu principal
      </a>
      <div className="flex flex-col min-h-screen">
          <Navbar />
          <main id="main-content" className="flex-grow"><AuthPage>{children}</AuthPage></main>
          <Footer />
      </div>
    </>
  );
}
