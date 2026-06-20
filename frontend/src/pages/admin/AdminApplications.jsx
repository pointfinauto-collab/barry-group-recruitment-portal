import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, CheckCircle, XCircle, Clock, Eye, FileText, X, Mail } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'received', label: 'Received' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'documents_required', label: 'Documents Required' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'employer_review', label: 'Employer Review' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'completed', label: 'Completed' },
];

const statusColors = {
  received: 'bg-blue-100 text-blue-700',
  under_review: 'bg-yellow-100 text-yellow-700',
  documents_required: 'bg-orange-100 text-orange-700',
  shortlisted: 'bg-purple-100 text-purple-700',
  employer_review: 'bg-indigo-100 text-indigo-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  completed: 'bg-gray-100 text-gray-700',
};

export default function AdminApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selected, setSelected] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const [generatingOffer, setGeneratingOffer] = useState(null);

  const fetch = async (s = search, st = status, p = page) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: p, limit: 15 });
      if (s) params.append('search', s);
      if (st) params.append('status', st);
      const res = await api.get(`/applications?${params}`);
      setApps(res.data.applications);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
    } catch { toast.error('Failed to fetch'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [page, status]);

  const handleStatusUpdate = async () => {
    if (!newStatus) { toast.error('Select a status'); return; }
    setUpdating(true);
    try {
      await api.put(`/applications/${selected.id}/status`, { status: newStatus, notes });
      toast.success('Status updated!');
      setSelected(null);
      setNewStatus('');
      setNotes('');
      fetch();
    } catch { toast.error('Update failed'); }
    finally { setUpdating(false); }
  };

  const handleGenerateOffer = async (app) => {
    if (!confirm(`Generate and send offer letter to ${app.first_name} ${app.last_name}?`)) return;
    setGeneratingOffer(app.id);
    try {
      await api.post(`/offer-letter/${app.id}/generate`);
      toast.success(`Offer letter sent to ${app.email}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate offer letter');
    } finally {
      setGeneratingOffer(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-navy-900">Applications</h1>
        <p className="text-gray-500 text-sm">{total} total applications</p>
      </div>

      <div className="card">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Search by name, email, or application number..."
              value={search} onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (setPage(1), fetch(search, status, 1))}
              className="input-field pl-12" />
          </div>
          <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }} className="input-field sm:w-48">
            {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <button onClick={() => { setPage(1); fetch(search, status, 1); }} className="btn-primary">Search</button>
        </div>
      </div>

      <div className="card overflow-x-auto p-0">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {['Application #', 'Applicant', 'Position', 'Country', 'LMIA Ref', 'Status', 'Date', 'Actions'].map(h => (
                <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              [...Array(8)].map((_, i) => (
                <tr key={i}><td colSpan={8} className="px-4 py-4"><div className="h-8 bg-gray-100 rounded animate-pulse" /></td></tr>
              ))
            ) : apps.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-16">
                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-200" />
                <p className="text-gray-400">No applications found</p>
              </td></tr>
            ) : apps.map(app => (
              <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4">
                  <span className="font-mono text-sm font-semibold text-navy-700">{app.application_number}</span>
                </td>
                <td className="px-4 py-4">
                  <p className="text-sm font-medium text-navy-800">{app.first_name} {app.last_name}</p>
                  <p className="text-xs text-gray-400">{app.email}</p>
                </td>
                <td className="px-4 py-4 text-sm text-gray-700 max-w-xs truncate">{app.desired_position}</td>
                <td className="px-4 py-4 text-sm text-gray-500">{app.country || '—'}</td>
                <td className="px-4 py-4">
                  {app.lmia_number
                    ? <span className="font-mono text-xs text-green-700 bg-green-50 px-2 py-1 rounded">{app.lmia_number}</span>
                    : <span className="text-gray-300 text-sm">—</span>}
                </td>
                <td className="px-4 py-4">
                  <span className={`badge ${statusColors[app.status] || 'bg-gray-100 text-gray-700'}`}>
                    {statusOptions.find(s => s.value === app.status)?.label || app.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-xs text-gray-400">{new Date(app.submitted_at).toLocaleDateString()}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1">
                    <button onClick={() => { setSelected(app); setNewStatus(app.status); setNotes(''); }}
                      className="p-1.5 text-navy-600 hover:bg-navy-50 rounded-lg transition-colors" title="Update Status">
                      <Eye className="w-4 h-4" />
                    </button>
                    {app.status === 'approved' && (
                      <button
                        onClick={() => handleGenerateOffer(app)}
                        disabled={generatingOffer === app.id}
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Generate and Send Offer Letter"
                      >
                        {generatingOffer === app.id
                          ? <span className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin block" />
                          : <Mail className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 p-4 border-t border-gray-100">
            {[...Array(Math.min(totalPages, 10))].map((_, i) => (
              <button key={i} onClick={() => setPage(i + 1)}
                className={`w-9 h-9 rounded-lg text-sm font-medium ${page === i + 1 ? 'bg-navy-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-navy-900">Update Application Status</h3>
                  <p className="text-sm text-gray-500 font-mono">{selected.application_number}</p>
                  <p className="text-sm text-gray-600">{selected.first_name} {selected.last_name}</p>
                </div>
                <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">New Status</label>
                  <select value={newStatus} onChange={e => setNewStatus(e.target.value)} className="input-field">
                    {statusOptions.filter(o => o.value).map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes (optional)</label>
                  <textarea rows={3} value={notes} onChange={e => setNotes(e.target.value)}
                    placeholder="Add notes for the applicant..." className="input-field resize-none" />
                </div>
                {newStatus === 'approved' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700">
                    An LMIA reference number will be automatically generated upon approval.
                  </div>
                )}
                <div className="flex gap-3">
                  <button onClick={() => setSelected(null)} className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm">Cancel</button>
                  <button onClick={handleStatusUpdate} disabled={updating} className="flex-1 btn-primary justify-center text-sm py-2.5">
                    {updating ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Update Status'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
