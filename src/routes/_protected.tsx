import { createFileRoute } from '@tanstack/react-router';
import { Protected } from "@/components/admin/Protected";
import { Shell } from "@/components/admin/Shell";

export const Route = createFileRoute('/_protected')({
  component: ProtectedLayout,
});

function ProtectedLayout() {
  return (
    <Protected>
      {/* Shell already has <Outlet /> inside it, so it doesn't need children! */}
      <Shell />
    </Protected>
  );
}