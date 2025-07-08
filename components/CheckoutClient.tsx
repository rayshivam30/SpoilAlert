"use client";
import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function CheckoutClient({ items, total }: { items: any[]; total: number }) {
  const [step, setStep] = React.useState<'form' | 'paying' | 'success'>("form");
  const [address, setAddress] = React.useState({ name: "", line1: "", city: "", zip: "" });
  const [payment, setPayment] = React.useState({ card: "", expiry: "", cvc: "" });
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStep("paying");
    setTimeout(() => setStep("success"), 1800);
  }

  if (step === "success") {
    return (
      <div className="container mx-auto px-4 py-12 max-w-lg text-center">
        <div className="text-green-600 text-4xl mb-4">✓</div>
        <div className="text-2xl font-bold mb-2">Payment Successful!</div>
        <div className="mb-4">Thank you for your purchase.</div>
        <div className="bg-gray-100 rounded p-4 mb-4">
          <div className="font-semibold mb-2">Order Summary</div>
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-2 mb-2">
              <Image src={item.image_url || "/placeholder.jpg"} alt={item.name} width={40} height={40} className="rounded" />
              <span className="flex-1 text-left">{item.name}</span>
              <span>x{item.quantity}</span>
              <span>{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
          <div className="font-bold mt-2">Total: {formatPrice(total)}</div>
        </div>
        <Button asChild className="mt-2 w-full"><a href="/">Continue Shopping</a></Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Button variant="outline" className="mb-4" onClick={() => router.back()}>
        Back
      </Button>
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8 bg-white rounded-lg shadow p-6">
        {/* Address */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
          <input className="mb-2 w-full border rounded px-3 py-2" placeholder="Full Name" required value={address.name} onChange={e => setAddress({ ...address, name: e.target.value })} />
          <input className="mb-2 w-full border rounded px-3 py-2" placeholder="Address Line 1" required value={address.line1} onChange={e => setAddress({ ...address, line1: e.target.value })} />
          <input className="mb-2 w-full border rounded px-3 py-2" placeholder="City" required value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} />
          <input className="mb-2 w-full border rounded px-3 py-2" placeholder="ZIP Code" required value={address.zip} onChange={e => setAddress({ ...address, zip: e.target.value })} />
        </div>
        {/* Payment */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
          <input className="mb-2 w-full border rounded px-3 py-2" placeholder="Card Number" required value={payment.card} onChange={e => setPayment({ ...payment, card: e.target.value })} maxLength={19} />
          <div className="flex gap-2">
            <input className="mb-2 w-full border rounded px-3 py-2" placeholder="MM/YY" required value={payment.expiry} onChange={e => setPayment({ ...payment, expiry: e.target.value })} maxLength={5} />
            <input className="mb-2 w-full border rounded px-3 py-2" placeholder="CVC" required value={payment.cvc} onChange={e => setPayment({ ...payment, cvc: e.target.value })} maxLength={4} />
          </div>
          <Button type="submit" className="w-full mt-2" disabled={step === "paying"}>{step === "paying" ? "Processing..." : `Pay ${formatPrice(total)}`}</Button>
        </div>
      </form>
      {/* Order Summary */}
      <div className="mt-8 bg-gray-50 rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-2">Order Summary</h2>
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-2 mb-2">
            <Image src={item.image_url || "/placeholder.jpg"} alt={item.name} width={40} height={40} className="rounded" />
            <span className="flex-1 text-left">{item.name}</span>
            <span>x{item.quantity}</span>
            <span>{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
        <div className="font-bold mt-2">Total: {formatPrice(total)}</div>
      </div>
    </div>
  );
} 