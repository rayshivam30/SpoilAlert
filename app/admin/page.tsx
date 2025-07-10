"use client";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/utils";
import BackButton from "@/components/BackButton";

// Dummy helpers (replace with real logic as needed)
const avgDailySales = 5;
const today = new Date();
function willProductSellBeforeExpiry(stock: number, avgSales: number, days: number) {
  return stock <= avgSales * days;
}
function suggestDiscount(daysToExpiry: number, atRisk: boolean) {
  if (!atRisk) return 0;
  if (daysToExpiry <= 1) return 50;
  if (daysToExpiry <= 3) return 30;
  if (daysToExpiry <= 7) return 15;
  return 0;
}
function formatDate(date: string) {
  return new Date(date).toLocaleDateString();
}

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!loading && !isRedirecting) {
      if (!user) {
        setIsRedirecting(true);
        router.replace("/login?redirect=/admin");
      } else if (user.role !== "admin") {
        setIsRedirecting(true);
        router.replace("/");
      }
    }
  }, [user, loading, router, isRedirecting]);

  if (loading || isRedirecting || !user || user.role !== "admin") {
    return <div className="p-8 text-center">Loading...</div>;
  }

  const [products, setProducts] = useState<any[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  // Add a fetchProducts function to refresh products after actions
  function fetchProducts() {
    setProductsLoading(true);
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setProductsLoading(false);
      });
  }

  // In useEffect, replace fetch with fetchProducts
  useEffect(() => {
    fetchProducts();
  }, []);

  // Calculate dashboard stats and at-risk products
  let atRiskCount = 0;
  let estimatedWaste = 0;
  let totalSuggestedDiscount = 0;
  const atRiskProductIds: number[] = [];
  const atRiskProducts: any[] = [];
  products.forEach((product: any) => {
    const expiryDate = product.expiry_date ? new Date(product.expiry_date) : null;
    const daysToExpiry = expiryDate ? Math.max(0, Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))) : 0;
    const willSell = willProductSellBeforeExpiry(product.stock_quantity, avgDailySales, daysToExpiry);
    const atRisk = !willSell;
    const discount = suggestDiscount(daysToExpiry, atRisk);
    if (atRisk) {
      atRiskCount++;
      estimatedWaste += product.stock_quantity;
      totalSuggestedDiscount += (product.price * product.stock_quantity * discount) / 100;
      atRiskProductIds.push(product.id);
      atRiskProducts.push({ ...product, daysToExpiry, discount });
    }
  });

  // Notification banner (client component)
  function AtRiskBanner() {
    const [dismissed, setDismissed] = useState(false);
    if (dismissed || atRiskProducts.length === 0) return null;
    return (
      <div className="mb-6 p-4 bg-orange-50 border-l-4 border-orange-400 rounded flex flex-col gap-2 relative">
        <button className="absolute top-2 right-2 text-xl text-orange-400 hover:text-orange-600" onClick={() => setDismissed(true)}>&times;</button>
        <div className="font-semibold text-orange-800 mb-1">⚠️ Attention: {atRiskProducts.length} product(s) at risk of expiry!</div>
        <ul className="list-disc list-inside text-sm text-orange-900">
          {atRiskProducts.slice(0, 5).map((p) => (
            <li key={p.id}>
              <span className="font-medium">{p.name}</span> — {p.daysToExpiry} day(s) left, suggest <span className="font-bold">{p.discount}% off</span>
            </li>
          ))}
        </ul>
        {atRiskProducts.length > 5 && <div className="text-xs text-orange-700 mt-1">...and {atRiskProducts.length - 5} more</div>}
      </div>
    );
  }

  // Client-side state for discount application
  function DiscountActions({ productId, discount, disabled, bulkApplied }: { productId: number, discount: number, disabled: boolean, bulkApplied: boolean }) {
    const [applied, setApplied] = useState(false);
    async function handleApply() {
      setApplied(true);
      toast({ title: "Discount Applied", description: `Applied ${discount}% off to product #${productId}` });
    }
    React.useEffect(() => {
      if (bulkApplied) setApplied(true);
    }, [bulkApplied]);
    return (
      <Button size="sm" variant="outline" disabled={applied || disabled} onClick={handleApply}>
        {applied ? "Applied" : `Apply ${discount}%`}
      </Button>
    );
  }

  // Bulk apply state
  const [bulkAppliedIds, setBulkAppliedIds] = React.useState<number[]>([]);
  function handleBulkApply() {
    // Apply discounts to selected products
    setBulkAppliedIds(selectedIds);
    
    // Calculate total discount value for selected products
    const selectedProducts = products.filter(p => selectedIds.includes(p.id));
    const totalDiscountValue = selectedProducts.reduce((sum, product) => {
      const expiryDate = product.expiry_date ? new Date(product.expiry_date) : null;
      const daysToExpiry = expiryDate ? Math.max(0, Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))) : 0;
      const willSell = willProductSellBeforeExpiry(product.stock_quantity, avgDailySales, daysToExpiry);
      const atRisk = !willSell;
      const discount = suggestDiscount(daysToExpiry, atRisk);
      return sum + (product.price * product.stock_quantity * discount) / 100;
    }, 0);
    
    toast({ 
      title: "Bulk Discount Applied", 
      description: `Applied discounts to ${selectedIds.length} products. Total value: ${formatPrice(totalDiscountValue)}` 
    });
    
    // Clear selection after applying
    setSelectedIds([]);
  }

  // Bulk selection state
  const [selectedIds, setSelectedIds] = React.useState<number[]>([]);
  const [modal, setModal] = React.useState<{ type: 'donate' | 'remove' | null, open: boolean }>({ type: null, open: false });
  const [donationReason, setDonationReason] = React.useState("");

  function handleSelect(id: number, checked: boolean) {
    setSelectedIds((prev) => checked ? [...prev, id] : prev.filter((x) => x !== id));
  }
  function handleSelectAll(checked: boolean) {
    if (checked) setSelectedIds(atRiskProductIds);
    else setSelectedIds([]);
  }
  function openModal(type: 'donate' | 'remove') {
    setModal({ type, open: true });
  }
  function closeModal() {
    setModal({ type: null, open: false });
    setDonationReason("");
  }
  async function handleBulkDonate() {
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "donate", productIds: selectedIds, reason: donationReason }),
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: "Donated", description: `Donated ${selectedIds.length} products. Reason: ${donationReason || 'N/A'}` });
        setSelectedIds([]);
        fetchProducts();
      } else {
        toast({ title: "Error", description: data.error || "Failed to donate products." });
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to donate products." });
    }
    closeModal();
  }
  async function handleBulkRemove() {
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "remove", productIds: selectedIds }),
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: "Removed", description: `Removed ${selectedIds.length} products from sale.` });
        setSelectedIds([]);
        fetchProducts();
      } else {
        toast({ title: "Error", description: data.error || "Failed to remove products." });
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to remove products." });
    }
    closeModal();
  }

  // Dummy analytics data for the last 6 weeks
  const analytics = {
    wastePrevented: 120, // units
    extraProfit: 850, // currency units
    weeks: ["W1", "W2", "W3", "W4", "W5", "W6"],
    atRiskCounts: [12, 10, 8, 7, 5, atRiskCount],
    wasteCounts: [30, 25, 20, 18, 15, estimatedWaste],
    discountValues: [200, 180, 160, 140, 120, Math.round(totalSuggestedDiscount)],
  };

  // Dummy sustainability impact data
  const sustainability = {
    foodSavedKg: 85, // kg
    co2SavedKg: 210, // kg
  };

  // Simple bar chart component
  function BarChart({ labels, values, color, label }: { labels: string[], values: number[], color: string, label: string }) {
    const max = Math.max(...values, 1);
    return (
      <div className="w-full">
        <div className="flex items-end gap-2 h-32">
          {values.map((v, i) => (
            <div key={i} className="flex flex-col items-center w-8">
              <div
                className="rounded-t bg-opacity-80"
                style={{ height: `${(v / max) * 100}%`, background: color, width: '100%' }}
                title={v.toString()}
              />
              <span className="text-xs mt-1">{v}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-2 justify-between mt-2">
          {labels.map((l, i) => (
            <span key={i} className="text-xs text-muted-foreground w-8 text-center">{l}</span>
          ))}
        </div>
        <div className="text-xs text-muted-foreground mt-1 text-center">{label}</div>
      </div>
    );
  }

  return (
      <div className="container mx-auto px-4 py-8">
      <BackButton />
      <h1 className="text-3xl font-bold mb-8">Manager Dashboard</h1>
      <AtRiskBanner />
      
      {/* Help Section */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
        <h3 className="font-semibold text-gray-800 mb-2">💡 How to Apply Bulk Discounts:</h3>
        <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
          <li>Select products that need discounts using the checkboxes</li>
          <li>Use "Select All At-Risk Products" to quickly select all expiring items</li>
          <li>Click "Apply Discount" to apply suggested discounts to all selected products</li>
          <li>Products with applied discounts will be highlighted in green</li>
        </ol>
      </div>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded shadow p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{atRiskCount}</div>
          <div className="text-sm text-muted-foreground">Products At Risk</div>
        </div>
        <div className="bg-white rounded shadow p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">{estimatedWaste}</div>
          <div className="text-sm text-muted-foreground">Estimated Waste (units)</div>
        </div>
        <div className="bg-white rounded shadow p-4 text-center">
          <div className="text-2xl font-bold text-green-700">{formatPrice(totalSuggestedDiscount)}</div>
          <div className="text-sm text-muted-foreground">Total Suggested Discount Value</div>
        </div>
      </div>
      {/* Analytics Section */}
      <div className="bg-white rounded shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Sales & Waste Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-700">{analytics.wastePrevented}</div>
            <div className="text-sm text-muted-foreground">Waste Prevented (units)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-700">{formatPrice(analytics.extraProfit)}</div>
            <div className="text-sm text-muted-foreground">Extra Profit from Discounts</div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <BarChart labels={analytics.weeks} values={analytics.atRiskCounts} color="#f87171" label="At Risk Products" />
          <BarChart labels={analytics.weeks} values={analytics.wasteCounts} color="#fbbf24" label="Estimated Waste" />
          <BarChart labels={analytics.weeks} values={analytics.discountValues} color="#34d399" label="Discount Value" />
        </div>
      </div>
      {/* Sustainability Impact Tracker */}
      <div className="bg-green-50 rounded shadow p-6 mb-8 flex flex-col md:flex-row gap-6 items-center justify-center">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🌱</span>
          <div>
            <div className="text-xl font-bold text-green-800">{sustainability.foodSavedKg} kg</div>
            <div className="text-sm text-green-900">Food Waste Prevented</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-3xl">🌍</span>
          <div>
            <div className="text-xl font-bold text-green-800">{sustainability.co2SavedKg} kg</div>
            <div className="text-sm text-green-900">CO₂ Emissions Saved</div>
          </div>
        </div>
        <div className="text-green-700 font-semibold text-center md:text-left mt-4 md:mt-0">
          Your store is saving the planet by reducing food waste and emissions!
        </div>
      </div>
      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="mb-4 flex gap-2 flex-wrap">
          <Button variant="default" onClick={handleBulkApply} className="bg-green-600 hover:bg-green-700">
            Apply Discount ({selectedIds.length})
          </Button>
          <Button variant="default" onClick={() => openModal('donate')} className="bg-blue-600 hover:bg-blue-700">
            Donate ({selectedIds.length})
          </Button>
          <Button variant="default" onClick={() => openModal('remove')} className="bg-red-600 hover:bg-red-700">
            Remove ({selectedIds.length})
          </Button>
        </div>
      )}
      
      {/* Quick Selection */}
      {atRiskProductIds.length > 0 && selectedIds.length === 0 && (
        <div className="mb-4">
          <Button 
            variant="outline" 
            onClick={() => handleSelectAll(true)}
            className="border-green-500 text-green-700 hover:bg-green-50"
          >
            Select All At-Risk Products ({atRiskProductIds.length})
          </Button>
        </div>
      )}
      
      {/* Selection Summary */}
      {selectedIds.length > 0 && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-blue-800">
                {selectedIds.length} product{selectedIds.length !== 1 ? 's' : ''} selected
              </span>
              <span className="text-sm text-blue-600 ml-2">
                (Click "Apply Discount" to apply suggested discounts)
              </span>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setSelectedIds([])}
              className="text-blue-600 border-blue-300 hover:bg-blue-100"
            >
              Clear Selection
            </Button>
          </div>
        </div>
      )}
      {/* Confirmation Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-2">{modal.type === 'donate' ? 'Confirm Donation' : 'Confirm Removal'}</h2>
            <div className="mb-4">Are you sure you want to {modal.type} {selectedIds.length} product(s)?</div>
            {modal.type === 'donate' && (
              <input
                className="mb-4 w-full border rounded px-3 py-2"
                placeholder="Reason for donation (optional)"
                value={donationReason}
                onChange={e => setDonationReason(e.target.value)}
              />
            )}
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={closeModal}>Cancel</Button>
              {modal.type === 'donate' ? (
                <Button variant="default" onClick={handleBulkDonate}>Confirm Donate</Button>
              ) : (
                <Button variant="default" onClick={handleBulkRemove}>Confirm Remove</Button>
              )}
                      </div>
                    </div>
              </div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">
                {atRiskProductIds.length > 0 && (
                  <input
                    type="checkbox"
                    checked={selectedIds.length === atRiskProductIds.length && atRiskProductIds.length > 0}
                    onChange={e => handleSelectAll(e.target.checked)}
                    aria-label="Select all at-risk products"
                  />
                )}
              </th>
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-left">Stock</th>
              <th className="p-3 text-left">Expiry</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Discount</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product: any) => {
              const expiryDate = product.expiry_date ? new Date(product.expiry_date) : null;
              const daysToExpiry = expiryDate ? Math.max(0, Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))) : 0;
              const willSell = willProductSellBeforeExpiry(product.stock_quantity, avgDailySales, daysToExpiry);
              const atRisk = !willSell;
              const discount = suggestDiscount(daysToExpiry, atRisk);
              const isBulkApplied = bulkAppliedIds.includes(product.id);
              const isSelected = selectedIds.includes(product.id);
              
              return (
                <tr key={product.id} className={`border-b ${isSelected ? 'bg-blue-50' : ''} ${isBulkApplied ? 'bg-green-50' : ''}`}>
                  <td className="p-3">
                    {atRisk && (
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(product.id)}
                        onChange={e => handleSelect(product.id, e.target.checked)}
                        aria-label={`Select product ${product.name}`}
                      />
                    )}
                  </td>
                  <td className="p-3 font-medium">
                    {product.name}
                    {isBulkApplied && (
                      <Badge variant="secondary" className="ml-2 text-xs">Discount Applied</Badge>
                    )}
                  </td>
                  <td className="p-3">{product.stock_quantity}</td>
                  <td className="p-3">{product.expiry_date ? formatDate(product.expiry_date) : "-"}</td>
                  <td className="p-3">
                    {willSell ? (
                      <Badge variant="default">Will Sell</Badge>
                    ) : (
                      <Badge variant="destructive">At Risk</Badge>
                    )}
                  </td>
                  <td className="p-3">
                    {atRisk && discount > 0 ? (
                      <Badge variant="secondary">{discount}% Off Suggested</Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="p-3">
                    {atRisk && discount > 0 ? (
                      <DiscountActions productId={product.id} discount={discount} disabled={isBulkApplied} bulkApplied={isBulkApplied} />
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
