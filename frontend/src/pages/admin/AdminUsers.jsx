import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Eye, UserX, UserCheck, Trash2, Shield, Users } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = async (s = search, p = page) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: p, limit: 15 });
      if (s) params.append('search', s);
      const res = await api.get(`/admin/users?${params}`);
      setUsers(res.data.users);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
    } catch { toast.error('Failed to fetch users'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, [page]);

  const handleAction = async (id, action) => {
    const labels = { suspend: 'suspend', unsuspend: 'unsuspend', deactivate: 'deactivate', activate: 'activate' };
    if (!confirm(`Are you sure you want to ${labels[action]} this user?`)) return;
    try {
      await api.put(`/admin/users/${id}/status`, { action });
      toast.success(`User ${action}d successfully`);
      fetchUsers();
    } catch { toast.error('Action failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Permanently delete this user and all their data? This cannot be undone.')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success('User deleted');
      fetchUsers();
    } catch { toast.error('Delete failed'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-display font-bold text-navy-900">Applicants</h1>
          <p className="text-gray-500 text-sm">{total} registered applicants</p>
        </div>
      </div>

      {/* Search */}
      <div className="card">
        <form onSubmit={e => { e.preventDefault(); setPage(1); fetchUsers(search, 1); }} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-12" />
          </div>
          <button type="submit" className="btn-primary">Search</button>
        </form>
      </div>

      {/* Table */}
      <div className="card overflow-x-auto p-0">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {['Applicant', 'Country', 'Status', 'Profile', 'Applications', 'Joined', 'Actions'].map(h => (
                <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              [...Array(8)].map((_, i) => (
                <tr key={i}><td colSpan={7} className="px-6 py-4"><div className="h-8 bg-gray-100 rounded animate-pulse" /></td></tr>
              ))
            ) : users.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-16 text-gray-400">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-30" /><p>No applicants found</p>
              </td></tr>
            ) : users.map(u => (
              <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-navy-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-navy-700 text-xs font-bold">{u.first_name?.[0]}{u.last_name?.[0]}</span>
                    </div>
                    <div>
                      <p className="font-medium text-navy-800 text-sm">{u.first_name} {u.last_name}</p>
                      <p className="text-xs text-gray-400">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{u.country || '—'}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    {u.is_suspended ? <span className="badge bg-red-100 text-red-700">Suspended</span>
                     : !u.is_active ? <span className="badge bg-gray-100 text-gray-500">Inactive</span>
                     : u.is_email_verified ? <span className="badge bg-green-100 text-green-700">Active</span>
                     : <span className="badge bg-yellow-100 text-yellow-700">Unverified</span>}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-navy-600 rounded-full" style={{ width: `${u.profile_completion || 0}%` }} />
                    </div>
                    <span className="text-xs text-gray-500">{u.profile_completion || 0}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-center text-gray-600">{u.application_count}</td>
                <td className="px-6 py-4 text-xs text-gray-400">{new Date(u.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Link to={`/admin/users/${u.id}`} className="p-1.5 text-navy-600 hover:bg-navy-50 rounded-lg transition-colors" title="View"><Eye className="w-4 h-4" /></Link>
                    {u.is_suspended
                      ? <button onClick={() => handleAction(u.id, 'unsuspend')} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg" title="Unsuspend"><UserCheck className="w-4 h-4" /></button>
                      : <button onClick={() => handleAction(u.id, 'suspend')} className="p-1.5 text-orange-500 hover:bg-orange-50 rounded-lg" title="Suspend"><UserX className="w-4 h-4" /></button>
                    }
                    <button onClick={() => handleDelete(u.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg" title="Delete"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 p-4 border-t border-gray-100">
            {[...Array(totalPages)].map((_, i) => (
              <button key={i} onClick={() => setPage(i + 1)}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${page === i + 1 ? 'bg-navy-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
