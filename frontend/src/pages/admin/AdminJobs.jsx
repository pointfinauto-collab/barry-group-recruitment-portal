import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, EyeOff, X, Briefcase } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const depts = ['Seafood Processing','Packaging','Warehouse','Logistics','Equipment and Maintenance','Cold Storage','Quality Control','Sanitation','Administrative','Management'];
const empty = { title:'', department:'Seafood Processing', location:'Nova Scotia, Canada', employment_type:'Full-Time', salary_min:'', salary_max:'', requirements:'', benefits:'', description:'', open_positions:1, is_published:false };

export default function AdminJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'create' | {job}
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const fetchJobs = () => {
    api.get('/jobs/admin/all').then(r => setJobs(r.data)).catch(() => toast.error('Failed to load jobs')).finally(() => setLoading(false));
  };

  useEffect(() => { fetchJobs(); }, []);

  const openCreate = () => { setForm(empty); setModal('create'); };
  const openEdit = (job) => {
    setForm({ ...job, salary_min: job.salary_min || '', salary_max: job.salary_max || '' });
    setModal(job);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (modal === 'create') {
        await api.post('/jobs', form);
        toast.success('Job created!');
      } else {
        await api.put(`/jobs/${modal.id}`, form);
        toast.success('Job updated!');
      }
      setModal(null);
      fetchJobs();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally { setSaving(false); }
  };

  const togglePublish = async (job) => {
    try {
      await api.put(`/jobs/${job.id}`, { ...job, is_published: !job.is_published });
      fetchJobs();
      toast.success(job.is_published ? 'Job unpublished' : 'Job published');
    } catch { toast.error('Failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this job posting?')) return;
    try { await api.delete(`/jobs/${id}`); toast.success('Job removed'); fetchJobs(); }
    catch { toast.error('Delete failed'); }
  };

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-display font-bold text-navy-900">Job Listings</h1>
          <p className="text-gray-500 text-sm">{jobs.length} total positions</p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <Plus className="w-5 h-5" /> Add Job
        </button>
      </div>

      <div className="card overflow-x-auto p-0">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {['Title', 'Department', 'Salary (CAD)', 'Positions', 'Applications', 'Status', 'Actions'].map(h => (
                <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? [...Array(6)].map((_, i) => (
              <tr key={i}><td colSpan={7} className="px-4 py-4"><div className="h-8 bg-gray-100 rounded animate-pulse" /></td></tr>
            )) : jobs.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-16">
                <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-200" />
                <p className="text-gray-400">No jobs yet. Add your first job posting.</p>
              </td></tr>
            ) : jobs.map(job => (
              <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4">
                  <p className="font-medium text-navy-800 text-sm">{job.title}</p>
                  <p className="text-xs text-gray-400">{job.location}</p>
                </td>
                <td className="px-4 py-4"><span className="badge bg-navy-100 text-navy-700 text-xs">{job.department}</span></td>
                <td className="px-4 py-4 text-sm text-gray-700">
                  ${Number(job.salary_min).toLocaleString()} – ${Number(job.salary_max).toLocaleString()}
                </td>
                <td className="px-4 py-4 text-sm text-center text-gray-700">{job.open_positions}</td>
                <td className="px-4 py-4 text-sm text-center text-gray-700">{job.application_count || 0}</td>
                <td className="px-4 py-4">
                  <span className={`badge ${job.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {job.is_published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEdit(job)} className="p-1.5 text-navy-600 hover:bg-navy-50 rounded-lg" title="Edit"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => togglePublish(job)} className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded-lg" title={job.is_published ? 'Unpublish' : 'Publish'}>
                      {job.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button onClick={() => handleDelete(job.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg" title="Delete"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {modal !== null && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 my-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-navy-900">{modal === 'create' ? 'Add New Job' : 'Edit Job'}</h3>
                <button onClick={() => setModal(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
                    <input required value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Seafood Processing Worker" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                    <select required value={form.department} onChange={e => set('department', e.target.value)} className="input-field">
                      {depts.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
                    <select value={form.employment_type} onChange={e => set('employment_type', e.target.value)} className="input-field">
                      {['Full-Time','Part-Time','Contract','Seasonal'].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Salary (CAD)</label>
                    <input type="number" value={form.salary_min} onChange={e => set('salary_min', e.target.value)} placeholder="36000" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Salary (CAD)</label>
                    <input type="number" value={form.salary_max} onChange={e => set('salary_max', e.target.value)} placeholder="85000" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Open Positions</label>
                    <input type="number" min="1" value={form.open_positions} onChange={e => set('open_positions', e.target.value)} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input value={form.location} onChange={e => set('location', e.target.value)} className="input-field" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
                    <textarea rows={3} value={form.requirements} onChange={e => set('requirements', e.target.value)} className="input-field resize-none" placeholder="Experience, skills, certifications..." />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Benefits</label>
                    <textarea rows={2} value={form.benefits} onChange={e => set('benefits', e.target.value)} className="input-field resize-none" placeholder="Health benefits, overtime, housing..." />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea rows={3} value={form.description} onChange={e => set('description', e.target.value)} className="input-field resize-none" />
                  </div>
                  <div className="sm:col-span-2 flex items-center gap-3">
                    <input type="checkbox" id="published" checked={form.is_published} onChange={e => set('is_published', e.target.checked)} className="w-4 h-4 accent-navy-800" />
                    <label htmlFor="published" className="text-sm font-medium text-gray-700">Publish immediately (visible to applicants)</label>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setModal(null)} className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm">Cancel</button>
                  <button type="submit" disabled={saving} className="flex-1 btn-primary justify-center text-sm py-2.5">
                    {saving ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : modal === 'create' ? 'Create Job' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
