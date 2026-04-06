import { Inter } from "next/font/google";
import NavbarAdmin from "@/components/layout/NavbarAdmin";
import Footer from "@/components/layout/Footer";
import SidebarAdmin from "@/components/layout/sideBarAdmin";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});


export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedRoute requiredRoles={["admin", "super_admin", "moderator"]}>
      <div className="flex flex-col min-h-screen">
        <NavbarAdmin />
        <div style={{ display: "flex", flex: 1 }}>
          <SidebarAdmin />
          <main className="flex-grow">{children}</main>
        </div>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
