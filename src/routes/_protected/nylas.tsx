import { createFileRoute } from '@tanstack/react-router';
import { NylasMonitor } from "@/pages/NylasMonitor";

export const Route = createFileRoute('/_protected/nylas')({
  component: NylasMonitor,
});