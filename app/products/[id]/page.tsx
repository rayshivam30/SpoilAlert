"use client";
import { useParams } from "next/navigation";

export default function ProductDetailsPage() {
  const params = useParams();
  return <div>Product Details Page for ID: {params.id} (Coming Soon)</div>;
} 