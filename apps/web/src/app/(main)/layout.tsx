import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AuthPage } from "@/components/layout/ProtectedPage";

export default function MainLayout({
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
        <main id="main-content" className="flex-grow">{children}</main>
        <Footer />
      </div>
    </>
  );
}
