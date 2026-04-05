import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, DollarSign, Activity } from 'lucide-react';
import axios from 'axios';

const Analytics = () => {
  const [growthData, setGrowthData] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any>(null);
  const [usageData, setUsageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [growthRes, revenueRes, usageRes] = await Promise.all([
          axios.get('http://localhost:3000/api/analytics/growth'),
          axios.get('http://localhost:3000/api/analytics/revenue'),
          axios.get('http://localhost:3000/api/analytics/usage'),
        ]);

        setGrowthData(growthRes.data);
        setRevenueData(revenueRes.data);
        setUsageData(usageRes.data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) return <div className="p-8">Loading analytics...</div>;

  const COLORS = ['#1D9E75', '#1A2340', '#EF9F27', '#E24B4A'];

  const pieData = revenueData ? Object.entries(revenueData.tierBreakdown).map(([name, value]) => ({ name, value })) : [];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-secondary">Analytics Dashboard</h1>
        <p className="text-textSecondary">Platform growth, revenue, and feature usage.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg text-primary">
              <DollarSign size={24} />
            </div>
            <div>
              <p className="text-sm text-textSecondary">MRR</p>
              <p className="text-2xl font-bold text-secondary">₹{revenueData?.mrr.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm text-textSecondary">Total Active Subs</p>
              <p className="text-2xl font-bold text-secondary">{revenueData?.totalActive}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-accent/10 rounded-lg text-accent">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm text-textSecondary">ARR (Projected)</p>
              <p className="text-2xl font-bold text-secondary">₹{revenueData?.arr.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 rounded-lg text-purple-500">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-sm text-textSecondary">AI Chats</p>
              <p className="text-2xl font-bold text-secondary">{usageData?.aiChats}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-secondary mb-6">User Growth (Last 30 Days)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" hide />
                <YAxis hide />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#1D9E75" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-secondary mb-6">Revenue by Tier</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {pieData.map((entry: any, index: number) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-xs text-textSecondary font-bold">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-secondary mb-6">Feature Adoption</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[
              { name: 'Meal Logs', count: usageData?.mealLogs },
              { name: 'Supp Logs', count: usageData?.supplementLogs },
              { name: 'AI Chats', count: usageData?.aiChats },
              { name: 'Plans', count: usageData?.planGens },
            ]}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#1D9E75" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
