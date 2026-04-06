import React, { useState, useEffect } from 'react';
import { History, Shield, Clock, FileText, User } from 'lucide-react';
import axios from 'axios';

const AuditLogs = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get('https://nourishiq-production.up.railway.app/api/admin/audit-logs');
        setLogs(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  if (loading) return <div className="p-8">Loading audit logs...</div>;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-secondary">Security & Audit Logs</h1>
        <p className="text-textSecondary">Monitor all administrative actions performed on the platform.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="bg-gray-50 p-4 flex items-center gap-2 text-secondary font-bold text-sm border-b border-gray-100">
          <History size={18} className="text-primary" />
          Recent Activity
        </div>
        
        <div className="divide-y divide-gray-50">
          {logs.map((log) => (
            <div key={log.id} className="p-4 hover:bg-gray-50/50 transition-all flex items-start gap-4">
              <div className="p-2 bg-gray-100 rounded-lg text-gray-500 mt-1">
                {log.action.includes('UPDATE') ? <Shield size={18} /> : <FileText size={18} />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-secondary text-sm">{log.action}</span>
                  <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                    {log.targetType || 'SYSTEM'}
                  </span>
                </div>
                <p className="text-xs text-textSecondary mb-2">{log.details}</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-[10px] text-textSecondary">
                    <User size={12} />
                    <span className="font-medium">Admin ID: {log.adminId.substr(0, 8)}...</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-textSecondary">
                    <Clock size={12} />
                    <span>{new Date(log.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {logs.length === 0 && (
          <div className="py-20 text-center text-textSecondary italic">
            No audit logs recorded yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLogs;
