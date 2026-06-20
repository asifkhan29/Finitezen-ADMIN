import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/App";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Finitezen AI — Admin" },
      { name: "description", content: "Finitezen AI admin dashboard: HR management, resume analytics, integrations, payments." },
    ],
  }),
  component: AppShell,
});
