import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, DollarSign, Target, Activity, Zap } from 'lucide-react';
import axios from 'axios';

const StatCard = ({ title, value, icon, color }: any) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
        {React.cloneElement(icon, { className: color.replace('bg-', 'text-') })}
      </div>
    </div>
    <h3 className="text-textSecondary text-sm font-medium">{title}</h3>
    <p className="text-2xl font-bold text-secondary mt-1">{value}</p>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, logsRes] = await Promise.all([
          axios.get('http://localhost:3000/api/admin/stats'),
          axios.get('http://localhost:3000/api/admin/audit-logs?limit=5'),
        ]);
        setStats(statsRes.data);
        setRecentLogs(logsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <div className="p-8">Loading dashboard...</div>;

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-secondary">Dashboard Overview</h1>
          <p className="text-textSecondary">Real-time health of NourishIQ platform.</p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-xs font-bold border border-green-100">
          <Zap size={14} /> System Operational
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Users" value={stats?.totalUsers.toLocaleString()} icon={<Users />} color="bg-blue-500" />
        <StatCard title="Active Subscriptions" value={stats?.activeSubscriptions.toLocaleString()} icon={<Target />} color="bg-primary" />
        <StatCard title="Today's Meal Logs" value={stats?.dailyMealLogs.toLocaleString()} icon={<Activity />} color="bg-accent" />
        <StatCard title="Pending Alerts" value={stats?.pendingAlerts.toLocaleString()} icon={<TrendingUp />} color="bg-red-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-secondary mb-4">Recent Audit Activity</h2>
          <div className="space-y-4">
            {recentLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold">
                    {log.action.substr(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-textPrimary">{log.action}</p>
                    <p className="text-xs text-textSecondary line-clamp-1">{log.details}</p>
                  </div>
                </div>
                <span className="text-[10px] text-textSecondary">{new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            ))}
            {recentLogs.length === 0 && <p className="text-center py-4 text-textSecondary italic">No recent activity.</p>}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-secondary mb-4">Engagement Metrics</h2>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-textSecondary">Average Adherence</span>
                <span className="text-sm font-bold text-primary">78%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: '78%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-textSecondary">Plan Generation Success</span>
                <span className="text-sm font-bold text-blue-500">99.8%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: '99.8%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-textSecondary">Notification Delivery</span>
                <span className="text-sm font-bold text-accent">96%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-accent" style={{ width: '96%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
