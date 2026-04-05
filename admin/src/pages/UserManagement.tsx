import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, MoreVertical, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/admin/users?search=${searchTerm}`);
        setUsers(res.data.users);
        setTotal(res.data.total);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [searchTerm]);

  return (
    <div className="p-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-secondary">User Management</h1>
          <p className="text-textSecondary">Manage and monitor all app users.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border border-gray-200 text-secondary px-4 py-2 rounded-lg font-bold text-sm shadow-sm hover:bg-gray-50">
            Bulk Action
          </button>
          <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-bold text-sm shadow-sm hover:bg-opacity-90 transition-all">
            <Download size={18} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm">
          <option value="">All Tiers</option>
          <option value="FREE">Free</option>
          <option value="CORE">Core</option>
          <option value="PRO">Pro</option>
          <option value="CLINIC">Clinic</option>
        </select>
        <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm">
          <option value="">Subscription Status</option>
          <option value="active">Active</option>
          <option value="cancelled">Cancelled</option>
          <option value="trialing">Trialing</option>
        </select>
        <button className="flex items-center gap-2 text-textSecondary bg-gray-50 px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-100">
          <Filter size={18} />
          More Filters
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-textSecondary uppercase tracking-wider">User</th>
              <th className="px-6 py-4 text-xs font-bold text-textSecondary uppercase tracking-wider">Tier</th>
              <th className="px-6 py-4 text-xs font-bold text-textSecondary uppercase tracking-wider">Joined</th>
              <th className="px-6 py-4 text-xs font-bold text-textSecondary uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-textSecondary uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {user.name.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-bold text-textPrimary">{user.name}</p>
                      <p className="text-xs text-textSecondary">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${user.subscriptionTier === 'FREE' ? 'bg-gray-100 text-gray-700' : 'bg-indigo-100 text-indigo-700'}`}>
                    {user.subscriptionTier}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-textSecondary">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <span className={`flex items-center gap-1.5 text-xs font-bold ${user.isVerified ? 'text-primary' : 'text-yellow-600'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${user.isVerified ? 'bg-primary' : 'bg-yellow-500'}`}></span>
                    {user.isVerified ? 'Verified' : 'Pending'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link to={`/users/${user.id}`} className="p-2 text-textSecondary hover:bg-gray-100 rounded-lg transition-colors">
                      <Eye size={18} />
                    </Link>
                    <button className="p-2 text-textSecondary hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Pagination */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs text-textSecondary">Showing 1 to 20 of 12,450 users</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-white border border-gray-200 rounded text-xs font-medium hover:bg-gray-50">Previous</button>
            <button className="px-3 py-1 bg-primary text-white rounded text-xs font-medium">1</button>
            <button className="px-3 py-1 bg-white border border-gray-200 rounded text-xs font-medium hover:bg-gray-50">2</button>
            <button className="px-3 py-1 bg-white border border-gray-200 rounded text-xs font-medium hover:bg-gray-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
