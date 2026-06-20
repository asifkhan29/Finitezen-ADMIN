import { createFileRoute } from '@tanstack/react-router';
import { HRDetail } from "@/pages/HRDetail";

export const Route = createFileRoute('/_protected/hrDetail/$id')({
  component: HRDetail,
});