import { createFileRoute } from '@tanstack/react-router';
import { HRList } from "@/pages/HRList";

export const Route = createFileRoute('/_protected/hrList')({
  component: HRList,
});