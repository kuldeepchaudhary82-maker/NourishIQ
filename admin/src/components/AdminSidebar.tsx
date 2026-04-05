import React, { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, CreditCard, BookOpen, Bell, BarChart2, Settings, LogOut, ShieldAlert } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SidebarItemProps {
  to: string;
  icon: ReactNode;
  label: string;
}

const SidebarItem = ({ to, icon, label }: SidebarItemProps) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
        isActive ? "bg-primary text-white" : "text-textSecondary hover:bg-gray-100"
      )
    }
  >
    {icon}
    <span className="font-medium">{label}</span>
  </NavLink>
);

const AdminSidebar = () => {
  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col p-4">
      <div className="px-4 py-6 mb-8">
        <h1 className="text-2xl font-bold text-primary">NourishIQ</h1>
        <p className="text-xs text-textSecondary uppercase tracking-widest mt-1">Admin Panel</p>
      </div>

      <nav className="flex-1 space-y-2">
        <SidebarItem to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" />
        <SidebarItem to="/users" icon={<Users size={20} />} label="Users" />
        <SidebarItem to="/subscriptions" icon={<CreditCard size={20} />} label="Subscriptions" />
        <SidebarItem to="/content" icon={<BookOpen size={20} />} label="Content" />
        <SidebarItem to="/notifications" icon={<Bell size={20} />} label="Broadcast" />
        <SidebarItem to="/analytics" icon={<BarChart2 size={20} />} label="Analytics" />
        <SidebarItem to="/clinic" icon={<Stethoscope size={20} />} label="Clinic Dashboard" />
        <SidebarItem to="/audit-logs" icon={<ShieldAlert size={20} />} label="Security Logs" />
      </nav>

      <div className="border-t border-gray-100 pt-4">
        <SidebarItem to="/settings" icon={<Settings size={20} />} label="Settings" />
        <button className="flex items-center gap-3 px-4 py-3 w-full text-textSecondary hover:bg-red-50 hover:text-danger rounded-lg transition-colors mt-2">
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
