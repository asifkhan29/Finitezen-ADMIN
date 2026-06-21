import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Shell } from './components/admin/Shell';
import { Protected } from './components/admin/Protected';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { ActivityLogs } from './pages/ActivityLogs';
import { HRList } from './pages/HRList';
import { NylasMonitor } from './pages/NylasMonitor';
import { FeedbackDesk } from './pages/FeedbackDesk';
import { PaymentsPage } from './pages/PaymentsPage';
import { LimitsPage } from './pages/LimitsPage';
import { HRDetail } from './pages/HRDetail';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected routes */}
        <Route path="/" element={<Protected><Shell /></Protected>}>
          <Route index element={<Dashboard />} />
          <Route path="activity" element={<ActivityLogs />} />
          <Route path="hrList" element={<HRList />} />
          <Route path="nylas" element={<NylasMonitor />} />
          <Route path="feedback" element={<FeedbackDesk />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="limits" element={<LimitsPage />} />
          <Route path="hr/:id" element={<HRDetail />} />
        </Route>

        {/* Catch-all: If user goes to any random URL, send them to Dashboard (Protected will handle the redirect to login if no token) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}