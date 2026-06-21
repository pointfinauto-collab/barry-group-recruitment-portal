import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Save, CheckCircle } from 'lucide-react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const countries = [
  'Afghanistan','Albania','Algeria','Angola','Argentina','Australia','Austria',
  'Bangladesh','Belgium','Bolivia','Brazil','Cambodia','Cameroon','Canada','Chile',
  'China','Colombia','Congo','Costa Rica','Croatia','Cuba','Czech Republic',
  'Denmark','Dominican Republic','Ecuador','Egypt','El Salvador','Ethiopia',
  'Finland','France','Germany','Ghana','Greece','Guatemala','Guinea','Haiti',
  'Honduras','Hungary','India','Indonesia','Iran','Iraq','Ireland','Israel',
  'Italy','Jamaica','Japan','Jordan','Kenya','South Korea','Lebanon','Libya',
  'Madagascar','Malaysia','Mali','Mexico','Morocco','Mozambique','Myanmar',
  'Nepal','Netherlands','New Zealand','Nicaragua','Niger','Nigeria','Norway',
  'Pakistan','Panama','Paraguay','Peru','Philippines','Poland','Portugal',
  'Romania','Russia','Rwanda','Saudi Arabia','Senegal','Serbia','Sierra Leone',
  'Somalia','South Africa','Spain','Sri Lanka','Sudan','Sweden','Switzerland',
  'Syria','Tanzania','Thailand','Togo','Tunisia','Turkey','Uganda','Ukraine',
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

const currentYear = new Date().getFullYear();
const graduationYears = Array.from({ length: 50 }, (_, i) => currentYear - i);

const experienceOptions = [
  { value: '0', label: 'No experience' },
  { value: '1', label: '1 year' },
  { value: '2', label: '2 years' },
  { value: '3', label: '3 years' },
  { value: '4', label: '4 years' },
  { value: '5', label: '5 years' },
  { value: '6', label: '6 years' },
  { value: '7', label: '7 years' },
  { value: '8', label: '8 years' },
  { value: '9', label: '9 years' },
  { value: '10', label: '10+ years' },
  { value: '15', label: '15+ years' },
  { value: '20', label: '20+ years' },
];

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    date_of_birth: '',
    gender: '',
    nationality: '',
    marital_status: '',
    address: '',
    city: '',
    country: '',
    passport_number: '',
    passport_issue_date: '',
    passport_expiry_date: '',
    education_level: '',
    institution_name: '',
    program: '',
    graduation_year: '',
    current_occupation: '',
    employer_name: '',
    years_of_experience: '',
    previous_employers: '',
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
        graduation_year: d.graduation_year?.toString() || '',
        current_occupation: d.current_occupation || '',
        employer_name: d.employer_name || '',
        years_of_experience: d.years_of_experience?.toString() || '',
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

  // Reusable label component
  const Label = ({ text, required }) => (
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {text} {required && <span className="text-red-500">*</span>}
    </label>
  );

  // Reusable select component
  const Select = ({ name, placeholder, options, value }) => (
    <select
      value={value || form[name]}
      onChange={e => set(name, e.target.value)}
      className="input-field bg-white cursor-pointer"
    >
      <option value="">{placeholder}</option>
      {options.map(o =>
        typeof o === 'string'
          ? <option key={o} value={o}>{o}</option>
          : <option key={o.value} value={o.value}>{o.label}</option>
      )}
    </select>
  );

  return (
    <div className="space-y-6 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-navy-900">My Profile</h1>
            <p className="text-gray-500 text-sm mt-1">
              Complete your profile to strengthen your application. Use the dropdowns to select values.
            </p>
          </div>
          {/* Completion Circle */}
          <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100">
            <div className="relative w-14 h-14">
              <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e2e8f0" strokeWidth="3.5" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1e4a7f" strokeWidth="3.5"
                  strokeDasharray={`${completion} 100`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-navy-800">{completion}%</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-navy-800">Profile</p>
              <p className="text-xs text-gray-500">Completion</p>
            </div>
          </div>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ── PERSONAL INFORMATION ── */}
        <div className="card">
          <h2 className="text-base font-semibold text-navy-900 mb-4 pb-3 border-b border-gray-100 flex items-center gap-2">
            <span className="w-7 h-7 bg-navy-800 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
            Personal Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div>
              <Label text="First Name" required />
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
              <Label text="Last Name" required />
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
              <Label text="Phone Number" />
              <input
                type="tel"
                value={form.phone}
                onChange={e => set('phone', e.target.value)}
                placeholder="+1 234 567 8900"
                className="input-field"
              />
              <p className="text-xs text-gray-400 mt-1">Include country code e.g. +254 700 000000</p>
            </div>

            <div>
              <Label text="Date of Birth" />
              <input
                type="date"
                value={form.date_of_birth}
                onChange={e => set('date_of_birth', e.target.value)}
                max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                min="1940-01-01"
                className="input-field"
              />
              <p className="text-xs text-gray-400 mt-1">Click the calendar icon to pick a date</p>
            </div>

            <div>
              <Label text="Gender" />
              <Select name="gender" placeholder="-- Select Gender --" options={genders} />
            </div>

            <div>
              <Label text="Marital Status" />
              <Select name="marital_status" placeholder="-- Select Marital Status --" options={maritalStatuses} />
            </div>

            <div>
              <Label text="Nationality" />
              <Select name="nationality" placeholder="-- Select Nationality --" options={countries} />
            </div>

          </div>
        </div>

        {/* ── CONTACT INFORMATION ── */}
        <div className="card">
          <h2 className="text-base font-semibold text-navy-900 mb-4 pb-3 border-b border-gray-100 flex items-center gap-2">
            <span className="w-7 h-7 bg-navy-800 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
            Contact Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div className="sm:col-span-2">
              <Label text="Street Address" />
              <input
                type="text"
                value={form.address}
                onChange={e => set('address', e.target.value)}
                placeholder="123 Main Street, Apartment 4B"
                className="input-field"
              />
            </div>

            <div>
              <Label text="City / Town" />
              <input
                type="text"
                value={form.city}
                onChange={e => set('city', e.target.value)}
                placeholder="Enter your city or town"
                className="input-field"
              />
            </div>

            <div>
              <Label text="Country" />
              <Select name="country" placeholder="-- Select Your Country --" options={countries} />
            </div>

          </div>
        </div>

        {/* ── PASSPORT INFORMATION ── */}
        <div className="card">
          <h2 className="text-base font-semibold text-navy-900 mb-4 pb-3 border-b border-gray-100 flex items-center gap-2">
            <span className="w-7 h-7 bg-navy-800 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
            Passport Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            <div>
              <Label text="Passport Number" />
              <input
                type="text"
                value={form.passport_number}
                onChange={e => set('passport_number', e.target.value.toUpperCase())}
                placeholder="e.g. A12345678"
                className="input-field font-mono tracking-widest"
                maxLength={20}
              />
              <p className="text-xs text-gray-400 mt-1">Enter exactly as shown on your passport</p>
            </div>

            <div>
              <Label text="Issue Date" />
              <input
                type="date"
                value={form.passport_issue_date}
                onChange={e => set('passport_issue_date', e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                min="2000-01-01"
                className="input-field"
              />
              <p className="text-xs text-gray-400 mt-1">Date passport was issued</p>
            </div>

            <div>
              <Label text="Expiry Date" />
              <input
                type="date"
                value={form.passport_expiry_date}
                onChange={e => set('passport_expiry_date', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                max="2040-12-31"
                className="input-field"
              />
              <p className="text-xs text-gray-400 mt-1">Must be valid for at least 6 months</p>
            </div>

          </div>
        </div>

        {/* ── EDUCATION ── */}
        <div className="card">
          <h2 className="text-base font-semibold text-navy-900 mb-4 pb-3 border-b border-gray-100 flex items-center gap-2">
            <span className="w-7 h-7 bg-navy-800 text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
            Education
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div>
              <Label text="Highest Education Level" />
              <Select
                name="education_level"
                placeholder="-- Select Education Level --"
                options={educationLevels}
              />
            </div>

            <div>
              <Label text="Graduation Year" />
              <Select
                name="graduation_year"
                placeholder="-- Select Year --"
                options={graduationYears.map(y => ({ value: String(y), label: String(y) }))}
              />
            </div>

            <div>
              <Label text="Institution / School Name" />
              <input
                type="text"
                value={form.institution_name}
                onChange={e => set('institution_name', e.target.value)}
                placeholder="Name of school or university"
                className="input-field"
              />
            </div>

            <div>
              <Label text="Program / Field of Study" />
              <input
                type="text"
                value={form.program}
                onChange={e => set('program', e.target.value)}
                placeholder="e.g. Business Administration"
                className="input-field"
              />
            </div>

          </div>
        </div>

        {/* ── WORK EXPERIENCE ── */}
        <div className="card">
          <h2 className="text-base font-semibold text-navy-900 mb-4 pb-3 border-b border-gray-100 flex items-center gap-2">
            <span className="w-7 h-7 bg-navy-800 text-white rounded-full flex items-center justify-center text-xs font-bold">5</span>
            Work Experience
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div>
              <Label text="Current Occupation / Job Title" />
              <input
                type="text"
                value={form.current_occupation}
                onChange={e => set('current_occupation', e.target.value)}
                placeholder="e.g. Fish Processing Worker"
                className="input-field"
              />
            </div>

            <div>
              <Label text="Current / Last Employer Name" />
              <input
                type="text"
                value={form.employer_name}
                onChange={e => set('employer_name', e.target.value)}
                placeholder="Company or organization name"
                className="input-field"
              />
            </div>

            <div>
              <Label text="Total Years of Experience" />
              <Select
                name="years_of_experience"
                placeholder="-- Select Years of Experience --"
                options={experienceOptions}
              />
            </div>

            <div className="sm:col-span-2">
              <Label text="Previous Employers (Optional)" />
              <textarea
                rows={3}
                value={form.previous_employers}
                onChange={e => set('previous_employers', e.target.value)}
                placeholder="List your previous employers and roles&#10;Example: ABC Company — Warehouse Worker (2019–2021)&#10;XYZ Factory — Packer (2021–2023)"
                className="input-field resize-none"
              />
            </div>

          </div>
        </div>

        {/* ── TIPS BOX ── */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">💡 Tips for Filling Your Profile</h3>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Use the <strong>dropdown menus</strong> to select your country, gender, education level, and experience</li>
            <li>• For <strong>dates</strong>, click the field and use the calendar picker that appears</li>
            <li>• Your <strong>passport number</strong> is automatically converted to uppercase</li>
            <li>• All fields with <span className="text-red-500 font-bold">*</span> are required</li>
            <li>• Click <strong>Save Profile</strong> at the bottom when done</li>
          </ul>
        </div>

        {/* ── SAVE BUTTON ── */}
        <div className="flex items-center gap-4 pb-8">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary px-10 py-3 text-base"
          >
            {loading
              ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <><Save className="w-5 h-5" /> Save Profile</>
            }
          </button>
          {completion === 100 && (
            <div className="flex items-center gap-2 text-green-600 font-medium">
              <CheckCircle className="w-5 h-5" />
              Profile 100% Complete!
            </div>
          )}
          {completion > 0 && completion < 100 && (
            <p className="text-sm text-gray-500">
              {completion}% complete — fill all fields to reach 100%
            </p>
          )}
        </div>

      </form>
    </div>
  );
}
