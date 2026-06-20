import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Fish, LayoutDashboard, Users, FileText, Briefcase, Upload, MessageSquare, LogOut, Menu, X, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/users', icon: Users, label: 'Applicants' },
  { to: '/admin/applications', icon: FileText, label: 'Applications' },
  { to: '/admin/jobs', icon: Briefcase, label: 'Job Listings' },
  { to: '/admin/documents', icon: Upload, label: 'Documents' },
  { to: '/admin/messages', icon: MessageSquare, label: 'Messages' },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Signed out');
    navigate('/');
  };

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-navy-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gold rounded-lg flex items-center justify-center">
            <Fish className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm">Barry Group</p>
            <p className="text-navy-400 text-xs flex items-center gap-1"><Shield className="w-3 h-3" /> Admin Panel</p>
          </div>
        </div>
      </div>

      <div className="p-4 border-b border-navy-800">
        <div className="flex items-center gap-3 p-3 bg-navy-800 rounded-xl">
          <div className="w-9 h-9 bg-red-500/20 rounded-full flex items-center justify-center">
            <Shield className="w-5 h-5 text-red-400" />
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">{user?.first_name} {user?.last_name}</p>
            <p className="text-red-400 text-xs capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label, end }) => (
          <NavLink key={to} to={to} end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive ? 'bg-gold text-white shadow-md' : 'text-navy-300 hover:bg-navy-800 hover:text-white'
              }`
            }
            onClick={() => setSidebarOpen(false)}>
            <Icon className="w-5 h-5 flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-navy-800">
        <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-navy-300 hover:text-red-400 hover:bg-red-900/20 rounded-xl text-sm font-medium transition-all">
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <aside className="hidden lg:flex flex-col w-64 bg-navy-950 flex-shrink-0">
        <Sidebar />
      </aside>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: 'tween' }}
              className="fixed left-0 top-0 h-full w-64 bg-navy-950 z-50 lg:hidden">
              <div className="absolute top-4 right-4">
                <button onClick={() => setSidebarOpen(false)} className="text-white p-1"><X className="w-5 h-5" /></button>
              </div>
              <Sidebar />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-4 py-4 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500">
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Shield className="w-4 h-4 text-red-500" />
            <span className="text-navy-800 font-medium">Admin Panel</span>
            <span>— Barry Group Inc.</span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
