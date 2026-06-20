import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Protected } from "@/components/admin/Protected";
import { Shell } from "@/components/admin/Shell";
import { Login } from "@/pages/Login";
import { Dashboard } from "@/pages/Dashboard";
import { HRList } from "@/pages/HRList";
import { HRDetail } from "@/pages/HRDetail";
import { ActivityLogs } from "@/pages/ActivityLogs";
import { NylasMonitor } from "@/pages/NylasMonitor";
import { FeedbackDesk } from "@/pages/FeedbackDesk";
import { PaymentsPage } from "@/pages/PaymentsPage";
import { LimitsPage } from "@/pages/LimitsPage";

export function AppShell() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<Protected><Shell /></Protected>}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/hr" element={<HRList />} />
          <Route path="/hr/:id" element={<HRDetail />} />
          <Route path="/activity" element={<ActivityLogs />} />
          <Route path="/nylas" element={<NylasMonitor />} />
          <Route path="/feedback" element={<FeedbackDesk />} />
          <Route path="/payments" element={<PaymentsPage />} />
          <Route path="/limits" element={<LimitsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppShell;
