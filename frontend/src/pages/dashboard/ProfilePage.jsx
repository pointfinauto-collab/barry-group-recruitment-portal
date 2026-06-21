import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Save, CheckCircle } from 'lucide-react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const countries = [
  'Afghanistan','Albania','Algeria','Angola','Argentina','Australia','Austria',
  'Bangladesh','Belgium','Bolivia','Brazil','Cambodia','Cameroon','Canada','Chile',
  'China','Colombia','Congo','Costa Rica','Côte d\'Ivoire','Croatia','Cuba',
  'Czech Republic','Denmark','Dominican Republic','Ecuador','Egypt','El Salvador',
  'Ethiopia','Finland','France','Gabon','Germany','Ghana','Greece','Guatemala',
  'Guinea','Haiti','Honduras','Hungary','India','Indonesia','Iran','Iraq','Ireland',
  'Israel','Italy','Jamaica','Japan','Jordan','Kenya','South Korea','Lebanon',
  'Libya','Madagascar','Malaysia','Mali','Mexico','Morocco','Mozambique','Myanmar',
  'Nepal','Netherlands','New Zealand','Nicaragua','Niger','Nigeria','Norway',
  'Pakistan','Panama','Paraguay','Peru','Philippines','Poland','Portugal','Romania',
  'Russia','Rwanda','Saudi Arabia','Senegal','Serbia','Sierra Leone','Somalia',
  'South Africa','Spain','Sri Lanka','Sudan','Sweden','Switzerland','Syria',
  'Tanzania','Thailand','Togo','Tunisia','Turkey','Uganda','Ukraine',
  'United Kingdom','United States','Uruguay','Venezuela','Vietnam','Yemen',
  'Zambia','Zimbabwe','Other'
];

const educationLevels = [
  'Primary School',
  'High School / Secondary',
  'Vocational / Trade Certificate',
  'Diploma',
  'Associate Degree',
  "Bachelor's Degree",
  "Master's Degree",
  'PhD / Doctorate',
  'Other',
];

const genders = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];
const maritalStatuses = ['Single', 'Married', 'Divorced', 'Widowed', 'Separated'];

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    first_name: '', last_name: '', phone: '',
    date_of_birth: '', gender: '', nationality: '', marital_status: '',
    address: '', city: '', country: '',
    passport_number: '', passport_issue_date: '', passport_expiry_date: '',
    education_level: '', institution_name: '', program: '', graduation_year: '',
    current_occupation: '', employer_name: '', years_of_experience: '', previous_employers: '',
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [completion, setCompletion] = useState(0);

  useEffect(() => {
    api.get('/profile').then(r => {
      const d = r.data;
      setForm({
        first_name: d.first_name || '',
        last_name: d.last_name || '',
        phone: d.phone || '',
        date_of_birth: d.date_of_birth?.split('T')[0] || '',
        gender: d.gender || '',
        nationality: d.nationality || '',
        marital_status: d.marital_status || '',
        address: d.address || '',
        city: d.city || '',
        country: d.country || '',
        passport_number: d.passport_number || '',
        passport_issue_date: d.passport_issue_date?.split('T')[0] || '',
        passport_expiry_date: d.passport_expiry_date?.split('T')[0] || '',
        education_level: d.education_level || '',
        institution_name: d.institution_name || '',
        program: d.program || '',
        graduation_year: d.graduation_year || '',
        current_occupation: d.current_occupation || '',
        employer_name: d.employer_name || '',
        years_of_experience: d.years_of_experience || '',
        previous_employers: d.previous_employers || '',
      });
      setCompletion(d.profile_completion || 0);
    }).catch(() => {}).finally(() => setFetching(false));
  }, []);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put('/profile', form);
      updateUser({ first_name: form.first_name, last_name: form.last_name });
      setCompletion(res.data.completion || completion);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-10 h-10 border-4 border-navy-800 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-display font-bold text-navy-900">My Profile</h1>
            <p className="text-gray-500 text-sm mt-1">Complete your profile to strengthen your application</p>
          </div>
          <div className="text-center">
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1e4a7f" strokeWidth="3"
                  strokeDasharray={`${completion} 100`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-navy-800">{completion}%</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Complete</p>
          </div>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Personal Information */}
        <div className="card">
          <h2 className="text-lg font-semibold text-navy-900 mb-5 flex items-center gap-2 pb-3 border-b border-gray-100">
            <User className="w-5 h-5 text-navy-600" /> Personal Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
              <input
                type="text"
                value={form.first_name}
                onChange={e => set('first_name', e.target.value)}
                placeholder="Enter your first name"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
              <input
                type="text"
                value={form.last_name}
                onChange={e => set('last_name', e.target.value)}
                placeholder="Enter your last name"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                value={form.phone}
                onChange={e => set('phone', e.target.value)}
                placeholder="+1 234 567 8900"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              <input
                type="date"
                value={form.date_of_birth}
                onChange={e => set('date_of_birth', e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select
                value={form.gender}
                onChange={e => set('gender', e.target.value)}
                className="input-field"
              >
                <option value="">-- Select Gender --</option>
                {genders.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
              <select
                value={form.marital_status}
                onChange={e => set('marital_status', e.target.value)}
                className="input-field"
              >
                <option value="">-- Select Status --</option>
                {maritalStatuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
              <select
                value={form.nationality}
                onChange={e => set('nationality', e.target.value)}
                className="input-field"
              >
                <option value="">-- Select Nationality --</option>
                {countries.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

          </div>
        </div>

        {/* Contact Information */}
        <div className="card">
          <h2 className="text-lg font-semibold text-navy-900 mb-5 pb-3 border-b border-gray-100">
            Contact Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
              <input
                type="text"
                value={form.address}
                onChange={e => set('address', e.target.value)}
                placeholder="123 Main Street, Apartment 4B"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                type="text"
                value={form.city}
                onChange={e => set('city', e.target.value)}
                placeholder="Enter your city"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <select
                value={form.country}
                onChange={e => set('country', e.target.value)}
                className="input-field"
              >
                <option value="">-- Select Country --</option>
                {countries.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

          </div>
        </div>

        {/* Passport Information */}
        <div className="card">
          <h2 className="text-lg font-semibold text-navy-900 mb-5 pb-3 border-b border-gray-100">
            Passport Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Passport Number</label>
              <input
                type="text"
                value={form.passport_number}
                onChange={e => set('passport_number', e.target.value.toUpperCase())}
                placeholder="e.g. A12345678"
                className="input-field tracking-widest"
                maxLength={20}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date</label>
              <input
                type="date"
                value={form.passport_issue_date}
                onChange={e => set('passport_issue_date', e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
              <input
                type="date"
                value={form.passport_expiry_date}
                onChange={e => set('passport_expiry_date', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="input-field"
              />
            </div>

          </div>
        </div>

        {/* Education */}
        <div className="card">
          <h2 className="text-lg font-semibold text-navy-900 mb-5 pb-3 border-b border-gray-100">
            Education
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Education Level</label>
              <select
                value={form.education_level}
                onChange={e => set('education_level', e.target.value)}
                className="input-field"
              >
                <option value="">-- Select Education Level --</option>
                {educationLevels.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Institution Name</label>
              <input
                type="text"
                value={form.institution_name}
                onChange={e => set('institution_name', e.target.value)}
                placeholder="Name of school or university"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Program / Field of Study</label>
              <input
                type="text"
                value={form.program}
                onChange={e => set('program', e.target.value)}
                placeholder="e.g. Business Administration"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Year</label>
              <select
                value={form.graduation_year}
                onChange={e => set('graduation_year', e.target.value)}
                className="input-field"
              >
                <option value="">-- Select Year --</option>
                {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i).map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {/* Work Experience */}
        <div className="card">
          <h2 className="text-lg font-semibold text-navy-900 mb-5 pb-3 border-b border-gray-100">
            Work Experience
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Occupation</label>
              <input
                type="text"
                value={form.current_occupation}
                onChange={e => set('current_occupation', e.target.value)}
                placeholder="e.g. Fish Processing Worker"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current / Last Employer</label>
              <input
                type="text"
                value={form.employer_name}
                onChange={e => set('employer_name', e.target.value)}
                placeholder="Company name"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
              <select
                value={form.years_of_experience}
                onChange={e => set('years_of_experience', e.target.value)}
                className="input-field"
              >
                <option value="">-- Select Years --</option>
                <option value="0">No experience</option>
                <option value="1">1 year</option>
                <option value="2">2 years</option>
                <option value="3">3 years</option>
                <option value="4">4 years</option>
                <option value="5">5 years</option>
                <option value="6">6 years</option>
                <option value="7">7 years</option>
                <option value="8">8 years</option>
                <option value="9">9 years</option>
                <option value="10">10+ years</option>
                <option value="15">15+ years</option>
                <option value="20">20+ years</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Previous Employers</label>
              <textarea
                rows={3}
                value={form.previous_employers}
                onChange={e => set('previous_employers', e.target.value)}
                placeholder="List your previous employers and roles, e.g. ABC Company — Warehouse Worker (2019–2021)"
                className="input-field resize-none"
              />
            </div>

          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center gap-4">
          <button type="submit" disabled={loading} className="btn-primary px-8">
            {loading
              ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <><Save className="w-5 h-5" /> Save Profile</>
            }
          </button>
          {completion === 100 && (
            <div className="flex items-center gap-2 text-green-600 font-medium text-sm">
              <CheckCircle className="w-5 h-5" />
              Profile Complete!
            </div>
          )}
        </div>

      </form>
    </div>
  );
}
