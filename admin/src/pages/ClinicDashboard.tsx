import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, TrendingUp, Activity, UserPlus, ExternalLink } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ClinicDashboard = () => {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await axios.get('https://nourishiq-production.up.railway.app/api/admin/users?role=USER');
        setPatients(res.data.users);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-8">Loading clinic dashboard...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-secondary">Clinic Patient Management</h1>
          <p className="text-textSecondary">Monitor progress and optimize plans for all patients in your clinic.</p>
        </div>
        <button className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 flex items-center gap-2 hover:bg-opacity-90 transition-all">
          <UserPlus size={18} />
          Invite New Patient
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-textSecondary text-xs font-bold uppercase tracking-widest mb-2">Total Patients</p>
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-bold text-secondary">{patients.length}</h3>
            <Users className="text-blue-500" size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-textSecondary text-xs font-bold uppercase tracking-widest mb-2">Avg. Adherence</p>
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-bold text-secondary">82%</h3>
            <Activity className="text-primary" size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-textSecondary text-xs font-bold uppercase tracking-widest mb-2">Active Alerts</p>
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-bold text-red-500">4</h3>
            <TrendingUp className="text-red-500" size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex flex-wrap gap-4 items-center justify-between">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or email..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button className="p-3 bg-gray-50 text-textSecondary rounded-xl hover:bg-gray-100 transition-all">
              <Filter size={20} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-[10px] font-bold text-textSecondary uppercase tracking-widest">Patient</th>
                <th className="px-6 py-4 text-[10px] font-bold text-textSecondary uppercase tracking-widest">Plan Type</th>
                <th className="px-6 py-4 text-[10px] font-bold text-textSecondary uppercase tracking-widest">Adherence</th>
                <th className="px-6 py-4 text-[10px] font-bold text-textSecondary uppercase tracking-widest">Last Activity</th>
                <th className="px-6 py-4 text-[10px] font-bold text-textSecondary uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50/50 transition-all">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {patient.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-secondary text-sm">{patient.name}</p>
                        <p className="text-[10px] text-textSecondary font-medium">{patient.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold uppercase border border-blue-100">
                      {patient.subscriptionTier}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="w-32">
                      <div className="flex justify-between mb-1">
                        <span className="text-[10px] font-bold text-secondary">85%</span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: '85%' }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-xs text-textSecondary font-medium">
                    2 hours ago
                  </td>
                  <td className="px-6 py-5 text-right">
                    <Link 
                      to={`/users/${patient.id}`}
                      className="inline-flex items-center gap-2 bg-gray-50 text-secondary px-4 py-2 rounded-xl text-xs font-bold hover:bg-gray-100 transition-all"
                    >
                      View Profile
                      <ExternalLink size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClinicDashboard;
