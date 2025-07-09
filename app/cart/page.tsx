import { RequireAuth } from "@/components/RequireAuth";
import BackButton from "@/components/BackButton";

export default function CartPage() {
  return (
    <RequireAuth>
      <BackButton />
      <div>Cart Page (Coming Soon)</div>
    </RequireAuth>
  );
} 