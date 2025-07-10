"use client";
import { useState, FormEvent, ChangeEvent } from "react";
import { ProductCard } from "@/components/product-card";
import type { Category, Product } from "@/lib/db";

interface CategoryClientPageProps {
  category: Category;
  products: Product[];
}

export default function CategoryClientPage({ category, products }: CategoryClientPageProps) {
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState<Product[]>(products);

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFiltered(
      products.filter((p: Product) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6 gap-4">
        <button onClick={() => window.history.back()} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Back</button>
        <h1 className="text-3xl font-bold flex-1">{category.name}</h1>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            className="border rounded px-3 py-2"
          />
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Search</button>
        </form>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.length > 0 ? (
          filtered.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div>No products found in this category.</div>
        )}
      </div>
    </div>
  );
} 