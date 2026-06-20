import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, CheckCircle, XCircle, Clock, Upload, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const statusLabels = {
  received: 'Received', under_review: 'Under Review', documents_required: 'Docs Required',
  shortlisted: 'Shortlisted', employer_review: 'Employer Review',
  approved: 'Approved', rejected: 'Rejected', completed: 'Completed',
};
const statusColors = {
  received: 'bg-blue-500', under_review: 'bg-yellow-500', documents_required: 'bg-orange-500',
  shortlisted: 'bg-purple-500', employer_review: 'bg-indigo-500',
  approved: 'bg-green-500', rejected: 'bg-red-500', completed: 'bg-gray-500',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard').then(r => setStats(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-10 h-10 border-4 border-navy-800 border-t-transparent rounded-full animate-spin" /></div>;

  const cards = [
    { label: 'Total Applicants', value: stats?.stats.total_users, icon: Users, color: 'bg-blue-500', link: '/admin/users' },
    { label: 'Total Applications', value: stats?.stats.total_applications, icon: FileText, color: 'bg-indigo-500', link: '/admin/applications' },
    { label: 'Pending Review', value: stats?.stats.pending_applications, icon: Clock, color: 'bg-yellow-500', link: '/admin/applications?status=under_review' },
    { label: 'Approved', value: stats?.stats.approved_applications, icon: CheckCircle, color: 'bg-green-500', link: '/admin/applications?status=approved' },
    { label: 'Rejected', value: stats?.stats.rejected_applications, icon: XCircle, color: 'bg-red-500', link: '/admin/applications?status=rejected' },
    { label: 'Pending Docs', value: stats?.stats.pending_documents, icon: Upload, color: 'bg-orange-500', link: '/admin/documents' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold text-navy-900">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Barry Group Inc. Recruitment Management</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {cards.map((c, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Link to={c.link} className="card hover:shadow-md transition-shadow block">
              <div className={`w-10 h-10 ${c.color} rounded-xl flex items-center justify-center mb-3`}>
                <c.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-navy-900">{c.value ?? '—'}</p>
              <p className="text-xs text-gray-500 mt-1">{c.label}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Applications by status */}
        <div className="card">
          <h2 className="font-semibold text-navy-900 mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5" />Applications by Status</h2>
          <div className="space-y-3">
            {stats?.by_status.map(({ status, count }) => {
              const pct = stats.stats.total_applications ? Math.round((count / stats.stats.total_applications) * 100) : 0;
              return (
                <div key={status}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{statusLabels[status] || status}</span>
                    <span className="font-semibold text-navy-800">{count}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${statusColors[status] || 'bg-gray-400'} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent applications */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-navy-900">Recent Applications</h2>
            <Link to="/admin/applications" className="text-xs text-navy-600 hover:text-navy-800">View all →</Link>
          </div>
          <div className="space-y-3">
            {stats?.recent_applications.slice(0, 7).map(app => (
              <div key={app.application_number} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-navy-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-navy-700 text-xs font-bold">{app.first_name?.[0]}{app.last_name?.[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-navy-800 truncate">{app.first_name} {app.last_name}</p>
                  <p className="text-xs text-gray-400 truncate">{app.desired_position}</p>
                </div>
                <span className={`badge text-xs ${statusColors[app.status] ? '' : 'bg-gray-100 text-gray-700'}`}
                  style={statusColors[app.status] ? { background: statusColors[app.status] + '20', color: statusColors[app.status].replace('bg-', '').replace('-500', '') } : {}}>
                  {statusLabels[app.status] || app.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
