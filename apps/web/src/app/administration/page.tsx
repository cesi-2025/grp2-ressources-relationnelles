"use client"
import { useEffect } from "react";

import { useRequireAdmin } from "@/context/AuthContext";
import { useRouter } from "next/navigation";


export default function AdminHome() {
  const {user, loading}= useRequireAdmin()
  const router = useRouter()

  useEffect(() => {
    if (loading || user && user.role !== "citoyen") router.replace("/administration");
  }, [user,loading,router])

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary-dark to-primary-light text-white py-24 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
        </div>
 
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Platforme d&apos;administration
            </h1>
            <p className="text-xl md:text-2xl mb-4 text-gray-100 max-w-3xl mx-auto leading-relaxed">
              Platforme a but de suppervoser l&apos;application et de permettre de gerer et manager les comptes utilisateur
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
