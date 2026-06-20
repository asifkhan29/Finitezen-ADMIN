import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/App";

export const Route = createFileRoute("/$")({
  component: AppShell,
});
