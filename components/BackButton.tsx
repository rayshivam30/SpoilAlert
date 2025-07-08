"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function BackButton() {
  const router = useRouter();
  return (
    <Button variant="outline" className="mb-4" onClick={() => router.back()}>
      Back
    </Button>
  );
} 