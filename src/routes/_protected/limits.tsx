import { createFileRoute } from '@tanstack/react-router';
import { LimitsPage } from "@/pages/LimitsPage";

export const Route = createFileRoute('/_protected/limits')({
  component: LimitsPage,
});