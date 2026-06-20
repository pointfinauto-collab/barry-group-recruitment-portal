import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Trash2, Download, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const docTypes = [
  { value: 'passport', label: 'Passport' },
  { value: 'resume', label: 'Resume / CV' },
  { value: 'degree_certificate', label: 'Degree Certificate' },
  { value: 'diploma', label: 'Diploma' },
  { value: 'transcript', label: 'Academic Transcript' },
  { value: 'experience_letter', label: 'Experience Letter' },
  { value: 'reference_letter', label: 'Reference Letter' },
  { value: 'professional_certificate', label: 'Professional Certificate' },
  { value: 'additional', label: 'Additional Document' },
];

const statusIcon = { approved: CheckCircle, pending: Clock, rejected: XCircle };
const statusColor = { approved: 'text-green-600', pending: 'text-yellow-600', rejected: 'text-red-600' };

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [docType, setDocType] = useState('resume');
  const fileRef = useRef();

  const fetchDocs = () => {
    api.get('/documents/my').then(r => setDocuments(r.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchDocs(); }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { toast.error('File too large. Max 10MB.'); return; }

    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('document_type', docType);

    try {
      await api.post('/documents/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Document uploaded successfully!');
      fetchDocs();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this document?')) return;
    try {
      await api.delete(`/documents/${id}`);
      setDocuments(prev => prev.filter(d => d.id !== id));
      toast.success('Document deleted');
    } catch { toast.error('Delete failed'); }
  };

  const handleDownload = async (id, filename) => {
    try {
      const res = await api.get(`/documents/download/${id}`, { responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
      URL.revokeObjectURL(url);
    } catch { toast.error('Download failed'); }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-bold text-navy-900">Document Center</h1>

      {/* Upload area */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
        <h2 className="text-lg font-semibold text-navy-900 mb-4 flex items-center gap-2">
          <Upload className="w-5 h-5 text-navy-600" /> Upload Document
        </h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <select value={docType} onChange={e => setDocType(e.target.value)} className="input-field flex-1">
            {docTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
          <label className={`btn-primary cursor-pointer ${uploading ? 'opacity-60 pointer-events-none' : ''}`}>
            {uploading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Upload className="w-5 h-5" />Choose File</>}
            <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleUpload} className="hidden" />
          </label>
        </div>
        <p className="text-xs text-gray-400 mt-3">Accepted: PDF, JPG, JPEG, PNG — Maximum size: 10MB</p>
      </motion.div>

      {/* Documents list */}
      <div className="card">
        <h2 className="text-lg font-semibold text-navy-900 mb-4">Uploaded Documents ({documents.length})</h2>
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />)}
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-14 h-14 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400">No documents uploaded yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map(doc => {
              const Icon = statusIcon[doc.status] || Clock;
              return (
                <div key={doc.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <FileText className="w-8 h-8 text-navy-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-navy-800 truncate">{doc.file_name}</p>
                    <p className="text-xs text-gray-500">{docTypes.find(t => t.value === doc.document_type)?.label || doc.document_type} • {(doc.file_size / 1024).toFixed(0)} KB</p>
                  </div>
                  <Icon className={`w-5 h-5 flex-shrink-0 ${statusColor[doc.status]}`} title={doc.status} />
                  <span className={`badge hidden sm:flex ${doc.status === 'approved' ? 'bg-green-100 text-green-700' : doc.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {doc.status}
                  </span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleDownload(doc.id, doc.file_name)} className="p-2 text-gray-400 hover:text-navy-700 transition-colors" title="Download">
                      <Download className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(doc.id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
