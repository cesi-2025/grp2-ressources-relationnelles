import { AuthProvider } from '@/context/AuthContext';
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
        <body className={`${inter.className} antialiased TotalExt-Lang-fr`}>
            <AuthProvider>
              {children}
            </AuthProvider>
        </body>
    </html>
  );
}