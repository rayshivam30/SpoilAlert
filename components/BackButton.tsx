"use client";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function BackButton() {
  const router = useRouter();
  const pathname = usePathname();
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    // Check if there's a previous page in history
    setCanGoBack(window.history.length > 1);
  }, []);

  const handleBack = () => {
    if (canGoBack && pathname !== "/") {
      router.back();
    } else {
      // If no previous page or we're already at home, go to home
      router.push("/");
    }
  };

  return (
    <Button variant="outline" className="mb-4" onClick={handleBack}>
      Back
    </Button>
  );
} 