import React, { useState, useEffect } from 'react';
import { CreditCard, Filter, Download, User, Calendar, ExternalLink } from 'lucide-react';
import axios from 'axios';

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');

  const fetchSubscriptions = async () => {
    try {
      const res = await axios.get(`https://nourishiq-production.up.railway.app/api/analytics/subscriptions?status=${filterStatus}`);
      setSubscriptions(res.data.subscriptions);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, [filterStatus]);

  if (loading) return <div className="p-8 text-secondary font-bold">Loading subscriptions...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-secondary">Subscription Management</h1>
          <p className="text-textSecondary">Monitor revenue, trials, and active plans.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-bold text-sm shadow-sm hover:bg-opacity-90 transition-all">
          <Download size={18} />
          Export Billing Data
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[300px]">
          <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by subscription ID or email..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <select 
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="cancelled">Cancelled</option>
          <option value="past_due">Past Due</option>
        </select>
        <button className="flex items-center gap-2 text-textSecondary bg-gray-50 px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-100">
          <Filter size={18} />
          Filter
        </button>
      </div>

      {/* Subscription Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-textSecondary uppercase tracking-wider">User</th>
              <th className="px-6 py-4 text-xs font-bold text-textSecondary uppercase tracking-wider">Tier</th>
              <th className="px-6 py-4 text-xs font-bold text-textSecondary uppercase tracking-wider">Started</th>
              <th className="px-6 py-4 text-xs font-bold text-textSecondary uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-textSecondary uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {subscriptions.length > 0 ? (
              subscriptions.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                        <User size={14} />
                      </div>
                      <div>
                        <p className="font-bold text-textPrimary text-sm">{sub.user.name}</p>
                        <p className="text-[10px] text-textSecondary font-medium">{sub.user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase border border-indigo-100">
                      {sub.tier}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs text-textSecondary">
                      <Calendar size={12} />
                      {new Date(sub.startedAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${sub.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-textSecondary hover:bg-gray-100 rounded-lg" title="View in Razorpay">
                        <ExternalLink size={16} />
                      </button>
                      <button className="text-xs font-bold text-danger hover:underline">Cancel</button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-20 text-center text-textSecondary italic">
                  No subscriptions found matching the filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Subscriptions;
