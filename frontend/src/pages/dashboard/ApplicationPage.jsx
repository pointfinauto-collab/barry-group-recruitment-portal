import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Send, CheckCircle, Clock, AlertCircle, Award, Download } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const provinces = ['Alberta','British Columbia','Manitoba','New Brunswick','Newfoundland and Labrador','Nova Scotia','Ontario','Prince Edward Island','Quebec','Saskatchewan','Northwest Territories','Nunavut','Yukon'];

const statusConfig = {
  received: { label: 'Application Received', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Clock },
  under_review: { label: 'Under Review', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Clock },
  documents_required: { label: 'Additional Documents Required', color: 'bg-orange-100 text-orange-700 border-orange-200', icon: AlertCircle },
  shortlisted: { label: 'Shortlisted', color: 'bg-purple-100 text-purple-700 border-purple-200', icon: Award },
  employer_review: { label: 'Employer Review', color: 'bg-indigo-100 text-indigo-700 border-indigo-200', icon: Clock },
  approved: { label: 'Approved ✓', color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700 border-red-200', icon: AlertCircle },
  completed: { label: 'Completed', color: 'bg-gray-100 text-gray-700 border-gray-200', icon: CheckCircle },
};

export default function ApplicationPage() {
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [hasOfferLetter, setHasOfferLetter] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({
    job_id: '', desired_position: '', education_level: '',
    experience_years: '', country_of_residence: '', preferred_province: '', additional_info: '',
  });

  useEffect(() => {
    Promise.all([
      api.get('/applications/my').then(r => {
        const app = r.data[0] || null;
        setApplication(app);
        if (app && app.status === 'approved') {
          api.get(`/offer-letter/${app.id}/preview`)
            .then(res => setHasOfferLetter(res.data.hasLetter))
            .catch(() => {});
        }
      }).catch(() => {}),
      api.get('/jobs?limit=50').then(r => setJobs(r.data.jobs || [])).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.desired_position) { toast.error('Please enter your desired position'); return; }
    setSubmitting(true);
    try {
      const res = await api.post('/applications', form);
      setApplication(res.data.application);
      toast.success('Application submitted successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadOfferLetter = async () => {
    setDownloading(true);
    try {
      const res = await api.get(`/offer-letter/${application.id}/download`, { responseType: 'blob' });
      const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `offer-letter-${application.application_number}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Offer letter downloaded!');
    } catch (err) {
      toast.error('Offer letter not available yet. Please contact admin.');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-10 h-10 border-4 border-navy-800 border-t-transparent rounded-full animate-spin" /></div>;

  if (application) {
    const info = statusConfig[application.status];
    const Icon = info?.icon || Clock;
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-display font-bold text-navy-900">My Application</h1>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-semibold text-navy-900">Application Details</h2>
              <p className="text-gray-500 mt-1">Application Number: <strong className="text-navy-700 text-lg">{application.application_number}</strong></p>
              {application.lmia_number && (
                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-700">LMIA Reference: <strong>{application.lmia_number}</strong></span>
                </div>
              )}
            </div>
            {info && (
              <span className={`badge ${info.color} border flex items-center gap-2 px-4 py-2`}>
                <Icon className="w-4 h-4" />{info.label}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">Position Applied</p>
              <p className="font-semibold text-navy-800">{application.desired_position}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">Preferred Province</p>
              <p className="font-semibold text-navy-800">{application.preferred_province || '—'}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">Submitted</p>
              <p className="font-semibold text-navy-800">{new Date(application.submitted_at).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>

          {/* Offer Letter Download - shown when approved */}
          {application.status === 'approved' && (
            <div className="mb-6 p-5 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-green-700" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-green-800 text-lg mb-1">🎉 Your Job Offer Letter is Ready!</h3>
                  <p className="text-green-700 text-sm mb-4">
                    Congratulations! Barry Group Inc. has approved your application. 
                    {hasOfferLetter 
                      ? ' Your offer letter has been sent to your email and is available for download below.'
                      : ' Your offer letter will be available for download once generated by our HR team.'}
                  </p>
                  {hasOfferLetter && (
                    <button
                      onClick={handleDownloadOfferLetter}
                      disabled={downloading}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg"
                    >
                      {downloading
                        ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        : <Download className="w-5 h-5" />
                      }
                      {downloading ? 'Downloading...' : 'Download Offer Letter (PDF)'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Status History */}
          {application.status_history && application.status_history.length > 0 && (
            <div>
              <h3 className="font-semibold text-navy-900 mb-4">Application Timeline</h3>
              <div className="space-y-3">
                {application.status_history.map((h, i) => {
                  const cfg = statusConfig[h.status];
                  return (
                    <div key={i} className="flex gap-4 items-start">
                      <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${i === 0 ? 'bg-navy-800' : 'bg-gray-300'}`} />
                      <div className="flex-1 pb-4 border-b border-gray-100 last:border-0">
                        <div className="flex justify-between">
                          <span className="font-medium text-navy-800 text-sm">{cfg?.label || h.status}</span>
                          <span className="text-xs text-gray-400">{new Date(h.created_at).toLocaleDateString()}</span>
                        </div>
                        {h.notes && <p className="text-xs text-gray-500 mt-1">{h.notes}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>

        <div className="card bg-blue-50 border-blue-200">
          <p className="text-sm text-blue-700">
            <strong>Note:</strong> LMIA reference numbers are internal recruitment tracking numbers used by Barry Group Inc. only. They do not constitute official government immigration decisions, work permits, or visas.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-bold text-navy-900">Submit Application</h1>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-6 h-6 text-navy-600" />
          <h2 className="text-lg font-semibold text-navy-900">Job Offer Request Form</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Select Job Position</label>
            <select value={form.job_id} onChange={e => {
              const job = jobs.find(j => j.id === e.target.value);
              set('job_id', e.target.value);
              if (job) set('desired_position', job.title);
            }} className="input-field">
              <option value="">Choose from available positions...</option>
              {jobs.map(j => <option key={j.id} value={j.id}>{j.title} — {j.department}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Desired Position *</label>
            <input type="text" required value={form.desired_position} onChange={e => set('desired_position', e.target.value)} placeholder="e.g. Seafood Processing Worker" className="input-field" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Education Level</label>
              <select value={form.education_level} onChange={e => set('education_level', e.target.value)} className="input-field">
                <option value="">Select...</option>
                {['High School', 'Diploma', 'Associate Degree', "Bachelor's Degree", "Master's Degree", 'PhD', 'Vocational/Trade Certificate', 'Other'].map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Years of Experience</label>
              <input type="number" min="0" max="50" value={form.experience_years} onChange={e => set('experience_years', e.target.value)} placeholder="0" className="input-field" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Country of Residence</label>
              <input type="text" value={form.country_of_residence} onChange={e => set('country_of_residence', e.target.value)} placeholder="Your current country" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Preferred Province in Canada</label>
              <select value={form.preferred_province} onChange={e => set('preferred_province', e.target.value)} className="input-field">
                <option value="">Any province</option>
                {provinces.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Additional Information</label>
            <textarea rows={4} value={form.additional_info} onChange={e => set('additional_info', e.target.value)}
              placeholder="Tell us about your skills, availability, and why you want to work with Barry Group Inc..."
              className="input-field resize-none" />
          </div>

          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Send className="w-5 h-5" />Submit Job Offer Request</>}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
