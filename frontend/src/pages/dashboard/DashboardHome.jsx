import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, User, Upload, MessageSquare, Bell, CheckCircle, Clock, AlertCircle, Award } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const statusConfig = {
  received: { label: 'Application Received', color: 'bg-blue-100 text-blue-700', icon: Clock },
  under_review: { label: 'Under Review', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  documents_required: { label: 'Documents Required', color: 'bg-orange-100 text-orange-700', icon: AlertCircle },
  shortlisted: { label: 'Shortlisted', color: 'bg-purple-100 text-purple-700', icon: Award },
  employer_review: { label: 'Employer Review', color: 'bg-indigo-100 text-indigo-700', icon: Clock },
  approved: { label: 'Approved', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700', icon: AlertCircle },
  completed: { label: 'Completed', color: 'bg-gray-100 text-gray-700', icon: CheckCircle },
};

const steps = [
  { key: 'received', label: 'Received' },
  { key: 'under_review', label: 'Under Review' },
  { key: 'shortlisted', label: 'Shortlisted' },
  { key: 'employer_review', label: 'Employer Review' },
  { key: 'approved', label: 'Approved' },
];

export default function DashboardHome() {
  const { user } = useAuth();
  const [application, setApplication] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/applications/my').then(r => setApplication(r.data[0] || null)).catch(() => {}),
      api.get('/notifications').then(r => setNotifications(r.data.slice(0, 5))).catch(() => {}),
      api.get('/profile').then(r => setProfile(r.data)).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  const currentStepIdx = application ? steps.findIndex(s => s.key === application.status) : -1;
  const statusInfo = application ? statusConfig[application.status] : null;
  const StatusIcon = statusInfo?.icon || Clock;

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-10 h-10 border-4 border-navy-800 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-navy-800 to-navy-900 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-display font-bold mb-1">Welcome back, {user?.first_name}! 👋</h1>
        <p className="text-blue-200 text-sm">Manage your application and track your employment journey with Barry Group Inc.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Application Status */}
        <div className="lg:col-span-2 space-y-6">
          {application ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-navy-900 mb-1">Application Status</h2>
                  <p className="text-sm text-gray-500">Application No: <strong className="text-navy-700">{application.application_number}</strong></p>
                  {application.lmia_number && (
                    <p className="text-sm text-gray-500 mt-1">LMIA Ref: <strong className="text-green-700">{application.lmia_number}</strong></p>
                  )}
                </div>
                {statusInfo && (
                  <span className={`badge ${statusInfo.color} flex items-center gap-1.5`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    {statusInfo.label}
                  </span>
                )}
              </div>

              {/* Progress tracker */}
              {application.status !== 'rejected' && (
                <div className="mb-6">
                  <div className="flex items-center">
                    {steps.map((step, i) => (
                      <React.Fragment key={step.key}>
                        <div className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                            i <= currentStepIdx ? 'bg-navy-800 text-white' : 'bg-gray-200 text-gray-500'
                          }`}>
                            {i < currentStepIdx ? <CheckCircle className="w-4 h-4" /> : i + 1}
                          </div>
                          <span className="text-xs text-gray-500 mt-1 text-center w-16 hidden sm:block">{step.label}</span>
                        </div>
                        {i < steps.length - 1 && (
                          <div className={`flex-1 h-1 mx-1 rounded ${i < currentStepIdx ? 'bg-navy-800' : 'bg-gray-200'}`} />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-500 mb-1">Desired Position</p>
                  <p className="font-medium text-navy-800">{application.desired_position}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-500 mb-1">Submitted</p>
                  <p className="font-medium text-navy-800">{new Date(application.submitted_at).toLocaleDateString()}</p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="card text-center py-10 border-dashed border-2 border-gray-200">
              <FileText className="w-14 h-14 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Application Yet</h3>
              <p className="text-gray-400 mb-6 text-sm">Complete your profile and submit your job application</p>
              <Link to="/dashboard/application" className="btn-primary">Submit Application</Link>
            </motion.div>
          )}

          {/* Quick links */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { to: '/dashboard/profile', icon: User, label: 'Profile', color: 'bg-blue-50 text-blue-700' },
              { to: '/dashboard/application', icon: FileText, label: 'Application', color: 'bg-green-50 text-green-700' },
              { to: '/dashboard/documents', icon: Upload, label: 'Documents', color: 'bg-purple-50 text-purple-700' },
              { to: '/dashboard/messages', icon: MessageSquare, label: 'Messages', color: 'bg-orange-50 text-orange-700' },
            ].map(({ to, icon: Icon, label, color }) => (
              <Link key={to} to={to} className="card hover:shadow-md transition-shadow text-center py-4">
                <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mx-auto mb-2`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-gray-700">{label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Profile completion */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card">
            <h3 className="font-semibold text-navy-900 mb-4">Profile Completion</h3>
            <div className="relative w-24 h-24 mx-auto mb-4">
              <svg className="w-24 h-24 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e2e8f0" strokeWidth="2.5" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1e4a7f" strokeWidth="2.5"
                  strokeDasharray={`${profile?.profile_completion || 0} 100`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-navy-800">{profile?.profile_completion || 0}%</span>
              </div>
            </div>
            {(profile?.profile_completion || 0) < 100 && (
              <Link to="/dashboard/profile" className="btn-primary w-full justify-center text-sm py-2">Complete Profile</Link>
            )}
          </motion.div>

          {/* Recent notifications */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-navy-900">Notifications</h3>
              <Link to="/dashboard/notifications" className="text-xs text-navy-600 hover:text-navy-800">View all</Link>
            </div>
            {notifications.length === 0 ? (
              <div className="text-center py-6">
                <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400">No notifications yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map(n => (
                  <div key={n.id} className={`p-3 rounded-lg border-l-4 ${n.is_read ? 'border-gray-200 bg-gray-50' : 'border-navy-600 bg-blue-50'}`}>
                    <p className="text-sm font-medium text-gray-800">{n.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
