"use client";
import { useAuth } from "@/components/AuthProvider";
import { useRouter, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!loading && !user && !isRedirecting) {
      setIsRedirecting(true);
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [user, loading, router, pathname, isRedirecting]);

  if (loading || isRedirecting || !user) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return <>{children}</>;
} 