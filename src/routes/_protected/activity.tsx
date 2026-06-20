import { createFileRoute } from '@tanstack/react-router';
import { ActivityLogs } from "@/pages/ActivityLogs";

export const Route = createFileRoute('/_protected/activity')({
  component: ActivityLogs,
});