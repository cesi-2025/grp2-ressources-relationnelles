"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../ui/Button";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const router = useRouter();
  const { user, isAuthenticated, logout, loading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const mobileMenuId = "main-mobile-menu";

  const navLinks = [
    { href: "/", label: "Accueil" },
    { href: "/ressources", label: "Ressources" },
    { href: "/presentation", label: "Présentation" },
    { href: "/aide", label: "Aide" },
  ];

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      setIsMenuOpen(false);
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50" aria-label="Navigation principale">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">(RE)</span>
            </div>
            <span className="text-xl font-bold text-primary hidden sm:block">
              Sources Relationnelles
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-primary transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {!loading && (
              <>
                {isAuthenticated && user ? (
                  <div className="flex items-center space-x-3">
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.role}</p>
                    </div>
                    {["admin", "super_admin", "moderator"].includes(user.role) && (
                      <Link href="/administration">
                        <Button variant="outline" size="sm">
                          Admin
                        </Button>
                      </Link>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                    >
                      {isLoggingOut ? "Déconnexion..." : "Déconnexion"}
                    </Button>
                  </div>
                ) : (
                  <>
                    <Link href="/auth/connexion">
                      <Button variant="outline" size="sm">
                        Connexion
                      </Button>
                    </Link>
                    <Link href="/auth/inscription">
                      <Button variant="primary" size="sm">
                        Inscription
                      </Button>
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Menu"
            aria-expanded={isMenuOpen}
            aria-controls={mobileMenuId}
            type="button"
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div id={mobileMenuId} className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-700 hover:text-primary transition-colors font-medium px-2 py-2 rounded-lg hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col space-y-2 pt-3 border-t border-gray-200">
                {!loading && (
                  <>
                    {isAuthenticated && user ? (
                      <>
                        <div className="px-2 py-2">
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.role}</p>
                        </div>
                        {["admin", "super_admin", "moderator"].includes(
                          user.role
                        ) && (
                          <Link
                            href="/administration"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <Button variant="outline" size="md" className="w-full">
                              Admin
                            </Button>
                          </Link>
                        )}
                        <Button
                          variant="outline"
                          size="md"
                          className="w-full"
                          onClick={handleLogout}
                          disabled={isLoggingOut}
                        >
                          {isLoggingOut ? "Déconnexion..." : "Déconnexion"}
                        </Button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/auth/connexion"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Button variant="outline" size="md" className="w-full">
                            Connexion
                          </Button>
                        </Link>
                        <Link
                          href="/auth/inscription"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Button variant="primary" size="md" className="w-full">
                            Inscription
                          </Button>
                        </Link>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
