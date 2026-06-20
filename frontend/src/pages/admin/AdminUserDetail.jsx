import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, User, FileText, Upload, Shield, CheckCircle, XCircle, Clock, Download } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const statusColors = {
  received: 'bg-blue-100 text-blue-700', under_review: 'bg-yellow-100 text-yellow-700',
  shortlisted: 'bg-purple-100 text-purple-700', approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700', completed: 'bg-gray-100 text-gray-700',
  documents_required: 'bg-orange-100 text-orange-700', employer_review: 'bg-indigo-100 text-indigo-700',
};

export default function AdminUserDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/admin/users/${id}`).then(r => setData(r.data)).catch(() => toast.error('Failed to load')).finally(() => setLoading(false));
  }, [id]);

  const handleDownload = async (docId, filename) => {
    try {
      const res = await api.get(`/documents/download/${docId}`, { responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
      URL.revokeObjectURL(url);
    } catch { toast.error('Download failed'); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-10 h-10 border-4 border-navy-800 border-t-transparent rounded-full animate-spin" /></div>;
  if (!data) return <div className="text-center py-16 text-gray-400">User not found</div>;

  const { user, documents, applications } = data;

  const fields = [
    ['Full Name', `${user.first_name} ${user.last_name}`],
    ['Email', user.email],
    ['Phone', user.phone || '—'],
    ['Country', user.country || '—'],
    ['Nationality', user.nationality || '—'],
    ['Date of Birth', user.date_of_birth ? new Date(user.date_of_birth).toLocaleDateString() : '—'],
    ['Gender', user.gender || '—'],
    ['Marital Status', user.marital_status || '—'],
    ['Address', user.address || '—'],
    ['City', user.city || '—'],
    ['Passport Number', user.passport_number || '—'],
    ['Passport Expiry', user.passport_expiry_date ? new Date(user.passport_expiry_date).toLocaleDateString() : '—'],
    ['Education Level', user.education_level || '—'],
    ['Institution', user.institution_name || '—'],
    ['Program', user.program || '—'],
    ['Graduation Year', user.graduation_year || '—'],
    ['Current Occupation', user.current_occupation || '—'],
    ['Employer', user.employer_name || '—'],
    ['Experience (yrs)', user.years_of_experience ?? '—'],
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/admin/users" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-display font-bold text-navy-900">{user.first_name} {user.last_name}</h1>
          <p className="text-gray-500 text-sm">{user.email}</p>
        </div>
        <div className="ml-auto flex gap-2">
          {user.is_suspended && <span className="badge bg-red-100 text-red-700">Suspended</span>}
          {!user.is_active && <span className="badge bg-gray-100 text-gray-500">Inactive</span>}
          {user.is_email_verified && user.is_active && !user.is_suspended && <span className="badge bg-green-100 text-green-700">Active</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile info */}
        <div className="lg:col-span-2 card">
          <h2 className="font-semibold text-navy-900 mb-4 flex items-center gap-2"><User className="w-5 h-5" />Applicant Profile</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map(([label, value]) => (
              <div key={label} className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                <p className="text-sm font-medium text-navy-800 break-words">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Applications + docs */}
        <div className="space-y-6">
          {/* Applications */}
          <div className="card">
            <h2 className="font-semibold text-navy-900 mb-4 flex items-center gap-2"><FileText className="w-5 h-5" />Applications ({applications.length})</h2>
            {applications.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">No applications</p>
            ) : (
              <div className="space-y-3">
                {applications.map(app => (
                  <div key={app.id} className="p-3 bg-gray-50 rounded-xl">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-mono text-xs font-bold text-navy-700">{app.application_number}</span>
                      <span className={`badge text-xs ${statusColors[app.status] || 'bg-gray-100 text-gray-700'}`}>{app.status}</span>
                    </div>
                    <p className="text-sm text-gray-700">{app.desired_position}</p>
                    {app.lmia_number && (
                      <p className="text-xs text-green-700 mt-1 font-mono">{app.lmia_number}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">{new Date(app.submitted_at).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Documents */}
          <div className="card">
            <h2 className="font-semibold text-navy-900 mb-4 flex items-center gap-2"><Upload className="w-5 h-5" />Documents ({documents.length})</h2>
            {documents.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">No documents uploaded</p>
            ) : (
              <div className="space-y-2">
                {documents.map(doc => (
                  <div key={doc.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-navy-800 truncate">{doc.file_name}</p>
                      <p className="text-xs text-gray-400">{doc.document_type} • {doc.status}</p>
                    </div>
                    <button onClick={() => handleDownload(doc.id, doc.file_name)} className="p-1.5 text-navy-600 hover:bg-navy-100 rounded-lg">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
