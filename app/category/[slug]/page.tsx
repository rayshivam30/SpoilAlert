"use client";
import { useParams } from "next/navigation";

export default function CategoryPage() {
  const params = useParams();
  return <div>Category Page for slug: {params.slug} (Coming Soon)</div>;
} 