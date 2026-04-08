"use client"
import {  useEffect, } from "react";

import { useRequireAdmin } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function DashboardPage() {

  const {user, loading}= useRequireAdmin()
  const router = useRouter()

  useEffect(() => {
    if (loading || user && user.role === "citoyen") router.replace("/dashboard");
  }, [user,loading,router])

  return (
    <div>
      
    </div>
  )
}

