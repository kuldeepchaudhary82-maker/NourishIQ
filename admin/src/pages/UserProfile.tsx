import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Activity, FlaskConical, Calendar, MessageSquare, Shield, AlertCircle } from 'lucide-react';
import axios from 'axios';

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you'd use the admin's token
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/admin/users/${id}`);
        setUser(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (!user) return <div className="p-8 text-danger">User not found</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <button 
        onClick={() => navigate('/users')}
        className="flex items-center gap-2 text-textSecondary hover:text-primary mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        <span className="font-medium">Back to All Users</span>
      </button>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: Basic Info & Actions */}
        <div className="w-full lg:w-1/3 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold mb-4">
                {user.name.split(' ').map((n: string) => n[0]).join('')}
              </div>
              <h1 className="text-2xl font-bold text-secondary">{user.name}</h1>
              <p className="text-textSecondary">{user.email}</p>
              <div className="flex gap-2 mt-4">
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider">
                  {user.subscriptionTier}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${user.isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {user.isVerified ? 'Verified' : 'Pending'}
                </span>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-gray-50">
              <div className="flex justify-between items-center text-sm">
                <span className="text-textSecondary">User ID</span>
                <span className="text-secondary font-mono text-xs">{user.id}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-textSecondary">Joined</span>
                <span className="text-secondary font-medium">{new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-textSecondary">Phone</span>
                <span className="text-secondary font-medium">{user.phone || 'Not provided'}</span>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <button className="w-full py-2.5 bg-primary text-white rounded-lg font-bold hover:bg-opacity-90 transition-all">
                Change Tier
              </button>
              <button className="w-full py-2.5 border border-gray-200 text-secondary rounded-lg font-bold hover:bg-gray-50 transition-all">
                Reset Password
              </button>
              <button className="w-full py-2.5 border border-red-100 text-danger rounded-lg font-bold hover:bg-red-50 transition-all">
                Suspend Account
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-secondary mb-4 flex items-center gap-2">
              <Shield size={18} className="text-primary" />
              Health Profile Summary
            </h3>
            {user.healthProfile ? (
              <div className="space-y-3">
                <div className="flex justify-between text-sm py-2 border-b border-gray-50">
                  <span className="text-textSecondary">Age / Gender</span>
                  <span className="text-secondary font-medium">{user.healthProfile.age} / {user.healthProfile.gender}</span>
                </div>
                <div className="flex justify-between text-sm py-2 border-b border-gray-50">
                  <span className="text-textSecondary">Height</span>
                  <span className="text-secondary font-medium">{user.healthProfile.heightCm} cm</span>
                </div>
                <div className="flex justify-between text-sm py-2 border-b border-gray-50">
                  <span className="text-textSecondary">Current Weight</span>
                  <span className="text-secondary font-medium">{user.healthProfile.currentWeight} kg</span>
                </div>
                <div className="flex justify-between text-sm py-2">
                  <span className="text-textSecondary">Target Weight</span>
                  <span className="text-secondary font-medium">{user.healthProfile.targetWeight} kg</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-textSecondary italic">Profile not completed.</p>
            )}
          </div>
        </div>

        {/* Right Column: Detailed Stats */}
        <div className="flex-1 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <p className="text-textSecondary text-xs font-bold uppercase tracking-wider mb-1">Adherence</p>
              <p className="text-2xl font-bold text-primary">82%</p>
              <p className="text-[10px] text-textSecondary mt-1">Average last 30 days</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <p className="text-textSecondary text-xs font-bold uppercase tracking-wider mb-1">Coach Chats</p>
              <p className="text-2xl font-bold text-secondary">24</p>
              <p className="text-[10px] text-textSecondary mt-1">Messages sent total</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <p className="text-textSecondary text-xs font-bold uppercase tracking-wider mb-1">Lab Retests</p>
              <p className="text-2xl font-bold text-accent">14 Days</p>
              <p className="text-[10px] text-textSecondary mt-1">Due based on protocol</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center">
              <h3 className="font-bold text-secondary flex items-center gap-2">
                <FlaskConical size={18} className="text-primary" />
                Latest Lab Markers
              </h3>
              <button className="text-xs text-primary font-bold hover:underline">View All History</button>
            </div>
            <div className="p-0">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-3 font-bold text-textSecondary uppercase tracking-wider text-[10px]">Marker</th>
                    <th className="px-6 py-3 font-bold text-textSecondary uppercase tracking-wider text-[10px]">Value</th>
                    <th className="px-6 py-3 font-bold text-textSecondary uppercase tracking-wider text-[10px]">Ref Range</th>
                    <th className="px-6 py-3 font-bold text-textSecondary uppercase tracking-wider text-[10px]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {user.labResults && user.labResults.length > 0 ? (
                    user.labResults.slice(0, 5).map((lab: any) => {
                      const isFlagged = lab.value < (lab.referenceMin || 0) || lab.value > (lab.referenceMax || 1000);
                      return (
                        <tr key={lab.id}>
                          <td className="px-6 py-4 font-bold text-secondary">{lab.markerName}</td>
                          <td className="px-6 py-4 text-textSecondary">{lab.value} {lab.unit}</td>
                          <td className="px-6 py-4 text-textSecondary">{lab.referenceMin} - {lab.referenceMax}</td>
                          <td className="px-6 py-4">
                            {isFlagged ? (
                              <span className="flex items-center gap-1 text-danger font-bold text-xs uppercase">
                                <AlertCircle size={12} /> Flagged
                              </span>
                            ) : (
                              <span className="text-primary font-bold text-xs uppercase">Optimal</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-textSecondary italic">No lab data recorded.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-secondary mb-4 flex items-center gap-2">
                <Activity size={18} className="text-primary" />
                Body Composition Trend
              </h3>
              <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg text-textSecondary italic text-sm">
                Chart Visualization Coming Soon
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-secondary mb-4 flex items-center gap-2">
                <MessageSquare size={18} className="text-primary" />
                Recent Coach Chat
              </h3>
              <div className="space-y-4">
                <div className="p-3 bg-gray-50 rounded-lg text-sm text-textPrimary leading-relaxed">
                  "How can I improve my HDL levels naturally?"
                  <p className="text-[10px] text-textSecondary mt-2">Sent 2 days ago</p>
                </div>
                <div className="p-3 border border-primary/20 bg-primary/5 rounded-lg text-sm text-secondary leading-relaxed italic">
                  "Focus on incorporating more fatty fish and olive oil into your lunch protocol..."
                  <p className="text-[10px] text-primary font-bold mt-2">AI Response</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
