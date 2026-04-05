import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import UserProfile from './pages/UserProfile';
import ContentManagement from './pages/ContentManagement';
import BroadcastNotifications from './pages/BroadcastNotifications';
import Analytics from './pages/Analytics';
import Subscriptions from './pages/Subscriptions';
import AuditLogs from './pages/AuditLogs';
import ClinicDashboard from './pages/ClinicDashboard';

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-background">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/users/:id" element={<UserProfile />} />
            <Route path="/content" element={<ContentManagement />} />
            <Route path="/notifications" element={<BroadcastNotifications />} />
            <Route path="/subscriptions" element={<Subscriptions />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/clinic" element={<ClinicDashboard />} />
            <Route path="/audit-logs" element={<AuditLogs />} />
            <Route path="/settings" element={<div className="p-8 text-secondary font-bold">Settings Panel (Coming Soon)</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
