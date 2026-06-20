import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, CheckCircle, XCircle, Clock, FileText, Search } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminDocuments() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');

  const fetch = async (s = status) => {
    setLoading(true);
    try {
      const params = s ? `?status=${s}` : '';
      const res = await api.get(`/documents${params}`);
      setDocs(res.data);
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [status]);

  const review = async (id, newStatus, notes = '') => {
    try {
      await api.put(`/documents/${id}/review`, { status: newStatus, admin_notes: notes });
      toast.success(`Document ${newStatus}`);
      fetch();
    } catch { toast.error('Review failed'); }
  };

  const handleDownload = async (id, filename) => {
    try {
      const res = await api.get(`/documents/download/${id}`, { responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
      URL.revokeObjectURL(url);
    } catch { toast.error('Download failed'); }
  };

  const docTypeLabels = {
    passport: 'Passport', resume: 'Resume/CV', degree_certificate: 'Degree Certificate',
    diploma: 'Diploma', transcript: 'Transcript', experience_letter: 'Experience Letter',
    reference_letter: 'Reference Letter', professional_certificate: 'Professional Certificate', additional: 'Additional',
  };

  const statusColor = { pending: 'bg-yellow-100 text-yellow-700', approved: 'bg-green-100 text-green-700', rejected: 'bg-red-100 text-red-700' };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-display font-bold text-navy-900">Documents ({docs.length})</h1>
        <select value={status} onChange={e => setStatus(e.target.value)} className="input-field w-44">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="card overflow-x-auto p-0">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {['Applicant', 'Document', 'Type', 'Size', 'Uploaded', 'Status', 'Actions'].map(h => (
                <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? [...Array(6)].map((_, i) => (
              <tr key={i}><td colSpan={7} className="px-4 py-4"><div className="h-8 bg-gray-100 rounded animate-pulse" /></td></tr>
            )) : docs.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-16">
                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-200" />
                <p className="text-gray-400">No documents found</p>
              </td></tr>
            ) : docs.map(doc => (
              <tr key={doc.id} className="hover:bg-gray-50">
                <td className="px-4 py-4">
                  <p className="text-sm font-medium text-navy-800">{doc.first_name} {doc.last_name}</p>
                  <p className="text-xs text-gray-400">{doc.email}</p>
                </td>
                <td className="px-4 py-4 text-sm text-gray-700 max-w-xs truncate">{doc.file_name}</td>
                <td className="px-4 py-4"><span className="badge bg-navy-100 text-navy-700 text-xs">{docTypeLabels[doc.document_type] || doc.document_type}</span></td>
                <td className="px-4 py-4 text-xs text-gray-500">{(doc.file_size / 1024).toFixed(0)} KB</td>
                <td className="px-4 py-4 text-xs text-gray-400">{new Date(doc.uploaded_at).toLocaleDateString()}</td>
                <td className="px-4 py-4"><span className={`badge ${statusColor[doc.status]}`}>{doc.status}</span></td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleDownload(doc.id, doc.file_name)} className="p-1.5 text-navy-600 hover:bg-navy-50 rounded-lg" title="Download"><Download className="w-4 h-4" /></button>
                    {doc.status === 'pending' && (
                      <>
                        <button onClick={() => review(doc.id, 'approved')} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg" title="Approve"><CheckCircle className="w-4 h-4" /></button>
                        <button onClick={() => review(doc.id, 'rejected')} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg" title="Reject"><XCircle className="w-4 h-4" /></button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
