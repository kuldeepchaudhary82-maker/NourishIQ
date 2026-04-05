import React, { useState } from 'react';
import { Send, Clock, Users, Smartphone, AlertCircle, ChevronRight, CheckCircle } from 'lucide-react';

import axios from 'axios';

const BroadcastNotifications = () => {
  const [target, setTarget] = useState('ALL');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    setSending(true);
    try {
      await axios.post('http://localhost:3000/api/admin/broadcast', {
        target,
        title,
        body,
      });
      setSent(true);
      setTitle('');
      setBody('');
      setTimeout(() => setSent(false), 3000);
    } catch (err) {
      console.error('Error sending broadcast:', err);
      alert('Failed to send broadcast');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-secondary">Broadcast Notifications</h1>
        <p className="text-textSecondary">Reach your users instantly with personalized push notifications.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Form */}
        <div className="flex-1 space-y-8">
          <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-secondary mb-6 flex items-center gap-2">
              <Users size={18} className="text-primary" />
              1. Select Audience
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { id: 'ALL', label: 'All Users', sub: '12,450 recipients', icon: <Users size={20} /> },
                { id: 'FREE', label: 'Free Tier', sub: '10,610 recipients', icon: <Smartphone size={20} /> },
                { id: 'PRO', label: 'Pro & Core', sub: '1,840 recipients', icon: <AlertCircle size={20} /> },
                { id: 'CITY', label: 'By Location', sub: 'Mumbai, Delhi, etc.', icon: <ChevronRight size={20} /> },
              ].map((t) => (
                <button 
                  key={t.id}
                  onClick={() => setTarget(t.id)}
                  className={`p-4 rounded-xl border transition-all text-left flex items-start gap-4 ${target === t.id ? 'bg-primary/5 border-primary shadow-sm' : 'bg-white border-gray-100 hover:border-gray-200'}`}
                >
                  <div className={`p-2 rounded-lg ${target === t.id ? 'bg-primary text-white' : 'bg-gray-50 text-textSecondary'}`}>
                    {t.icon}
                  </div>
                  <div>
                    <p className="font-bold text-secondary text-sm">{t.label}</p>
                    <p className="text-[10px] text-textSecondary mt-0.5">{t.sub}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-secondary mb-6 flex items-center gap-2">
              <Smartphone size={18} className="text-primary" />
              2. Compose Message
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-textSecondary uppercase tracking-widest mb-2">Notification Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Weekend Health Tip"
                  className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-textSecondary uppercase tracking-widest mb-2">Message Body</label>
                <textarea 
                  rows={4}
                  placeholder="Keep it concise and actionable..."
                  className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                />
                <p className="text-[10px] text-textSecondary mt-2 flex justify-between">
                  <span>Recommendation: Max 120 characters</span>
                  <span>{body.length} / 120</span>
                </p>
              </div>
              
              <div className="flex gap-4 pt-4">
                <button 
                  onClick={handleSend}
                  disabled={!title || !body || sending}
                  className={`flex-1 flex items-center justify-center gap-2 h-12 rounded-lg font-bold transition-all shadow-md ${sending || sent ? 'bg-green-500 text-white' : 'bg-primary text-white hover:bg-opacity-90'}`}
                >
                  {sending ? (
                    'Sending...'
                  ) : sent ? (
                    <><CheckCircle size={20} /> Broadcast Sent!</>
                  ) : (
                    <><Send size={18} /> Send Now</>
                  )}
                </button>
                <button className="flex items-center justify-center gap-2 px-6 h-12 border border-gray-200 text-secondary rounded-lg font-bold hover:bg-gray-50 transition-all">
                  <Clock size={18} />
                  Schedule
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="w-full lg:w-80">
          <div className="sticky top-8">
            <p className="text-xs font-bold text-textSecondary uppercase tracking-widest mb-4">Mobile Preview</p>
            <div className="w-full aspect-[9/18.5] bg-secondary rounded-[40px] p-3 shadow-2xl relative overflow-hidden">
              {/* Mock Screen Content */}
              <div className="w-full h-full bg-black/90 rounded-[32px] overflow-hidden p-6 pt-12 relative">
                {/* Notification Bubble */}
                <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl animate-bounce">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-5 h-5 bg-primary rounded-md flex items-center justify-center text-[10px] text-white font-bold">NIQ</div>
                    <span className="text-[10px] font-bold text-secondary uppercase">NourishIQ</span>
                    <span className="text-[10px] text-textSecondary ml-auto">now</span>
                  </div>
                  <h4 className="text-xs font-bold text-textPrimary leading-tight mb-0.5">{title || 'Your Title Here'}</h4>
                  <p className="text-[10px] text-textSecondary leading-snug">{body || 'Your message body will appear here...'}</p>
                </div>
                
                {/* Time/Status Bar */}
                <div className="absolute top-4 left-0 right-0 px-8 flex justify-between items-center">
                  <span className="text-white text-[10px] font-bold">9:41</span>
                  <div className="flex gap-1">
                    <div className="w-3 h-1 bg-white/20 rounded-full" />
                    <div className="w-1 h-1 bg-white rounded-full" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 bg-blue-50 p-4 rounded-xl border border-blue-100">
              <div className="flex items-center gap-2 text-blue-800 font-bold text-xs mb-2">
                <AlertCircle size={14} />
                <span>Best Practice</span>
              </div>
              <p className="text-[11px] text-blue-700 leading-relaxed">
                Broadcast notifications sent between 10 AM and 1 PM typically see 24% higher engagement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BroadcastNotifications;
