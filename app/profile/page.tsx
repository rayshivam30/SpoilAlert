import { RequireAuth } from "@/components/RequireAuth";
import BackButton from "@/components/BackButton";

export default function ProfilePage() {
  return (
    <RequireAuth>
      <BackButton />
      <div>Profile Page (Coming Soon)</div>
    </RequireAuth>
  );
} 