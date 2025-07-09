"use client";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return <>{children}</>;
} 