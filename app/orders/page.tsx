import { RequireAuth } from "@/components/RequireAuth";
import BackButton from "@/components/BackButton";

export default function OrdersPage() {
  return (
    <RequireAuth>
      <BackButton />
      <div>Orders Page (Coming Soon)</div>
    </RequireAuth>
  );
} 