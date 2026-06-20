import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Briefcase, Filter, ChevronDown, ArrowRight } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import api from '../utils/api';

const statusColors = {
  'Seafood Processing': 'bg-blue-100 text-blue-700',
  'Packaging': 'bg-purple-100 text-purple-700',
  'Warehouse': 'bg-yellow-100 text-yellow-700',
  'Logistics': 'bg-orange-100 text-orange-700',
  'Quality Control': 'bg-green-100 text-green-700',
  'Cold Storage': 'bg-cyan-100 text-cyan-700',
  'Equipment and Maintenance': 'bg-red-100 text-red-700',
  'Sanitation': 'bg-pink-100 text-pink-700',
  'Administrative': 'bg-indigo-100 text-indigo-700',
  'Management': 'bg-navy-100 text-navy-700',
};

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 12 });
      if (search) params.append('search', search);
      if (department) params.append('department', department);
      const res = await api.get(`/jobs?${params}`);
      setJobs(res.data.jobs || []);
      setTotal(res.data.total || 0);
      setTotalPages(res.data.totalPages || 1);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    api.get('/jobs/departments').then(r => setDepartments(r.data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [page, department]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchJobs();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <div className="bg-navy-950 pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl sm:text-5xl font-display text-white mb-4">Employment Opportunities</h1>
            <p className="text-blue-200 text-lg">{total} open positions across Barry Group Inc. facilities in Canada</p>
          </motion.div>

          {/* Search */}
          <motion.form onSubmit={handleSearch} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="mt-8 flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" placeholder="Search jobs..." value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-gold text-gray-800" />
            </div>
            <button type="submit" className="btn-primary px-8 py-4 rounded-xl">Search</button>
          </motion.form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="card sticky top-8">
              <h3 className="font-semibold text-navy-900 mb-4 flex items-center gap-2">
                <Filter className="w-4 h-4" /> Filter by Department
              </h3>
              <div className="space-y-2">
                <button onClick={() => { setDepartment(''); setPage(1); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!department ? 'bg-navy-800 text-white' : 'hover:bg-gray-100 text-gray-700'}`}>
                  All Departments ({total})
                </button>
                {departments.map(d => (
                  <button key={d.department} onClick={() => { setDepartment(d.department); setPage(1); }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${department === d.department ? 'bg-navy-800 text-white' : 'hover:bg-gray-100 text-gray-700'}`}>
                    {d.department} ({d.count})
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Jobs grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="card animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
                    <div className="h-10 bg-gray-200 rounded" />
                  </div>
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="card text-center py-16">
                <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No positions found</h3>
                <p className="text-gray-400">Try adjusting your search or filter criteria.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {jobs.map((job, i) => (
                    <motion.div key={job.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                      className="card hover:shadow-lg transition-all border-l-4 border-l-navy-800 group">
                      <div className="flex justify-between items-start mb-3">
                        <span className={`badge ${statusColors[job.department] || 'bg-gray-100 text-gray-700'}`}>{job.department}</span>
                        <span className="badge bg-green-100 text-green-700">{job.open_positions} Open</span>
                      </div>
                      <h3 className="font-display font-bold text-navy-900 text-lg mb-2 group-hover:text-gold transition-colors">{job.title}</h3>
                      <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
                        <MapPin className="w-4 h-4 flex-shrink-0" /><span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                        <Briefcase className="w-4 h-4 flex-shrink-0" /><span>{job.employment_type}</span>
                      </div>
                      <div className="text-sm font-semibold text-navy-700 mb-3">
                        CAD ${Number(job.salary_min).toLocaleString()} – ${Number(job.salary_max).toLocaleString()} / year
                      </div>
                      {job.requirements && (
                        <p className="text-xs text-gray-500 mb-4 line-clamp-2 leading-relaxed">{job.requirements}</p>
                      )}
                      {job.benefits && (
                        <p className="text-xs text-green-700 mb-4 line-clamp-1"><span className="font-medium">Benefits:</span> {job.benefits}</p>
                      )}
                      <Link to="/register" className="btn-primary w-full justify-center text-sm py-2.5">
                        Apply for This Position <ArrowRight className="w-4 h-4" />
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    {[...Array(totalPages)].map((_, i) => (
                      <button key={i} onClick={() => setPage(i + 1)}
                        className={`w-10 h-10 rounded-lg font-medium text-sm transition-colors ${page === i + 1 ? 'bg-navy-800 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
