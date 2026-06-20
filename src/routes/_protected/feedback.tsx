import { createFileRoute } from '@tanstack/react-router';
import { FeedbackDesk } from "@/pages/FeedbackDesk";

export const Route = createFileRoute('/_protected/feedback')({
  component: FeedbackDesk,
});