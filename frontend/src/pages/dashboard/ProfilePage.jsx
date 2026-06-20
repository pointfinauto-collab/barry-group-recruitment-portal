import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Save, CheckCircle } from 'lucide-react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const countries = ['Afghanistan','Albania','Algeria','Argentina','Australia','Austria','Bangladesh','Belgium','Brazil','Cambodia','Canada','Chile','China','Colombia','Egypt','Ethiopia','France','Germany','Ghana','India','Indonesia','Iran','Iraq','Ireland','Italy','Jamaica','Japan','Jordan','Kenya','Malaysia','Mexico','Morocco','Myanmar','Nepal','Netherlands','New Zealand','Nigeria','Norway','Pakistan','Philippines','Poland','Portugal','Romania','Russia','Saudi Arabia','Senegal','Sierra Leone','Somalia','South Africa','Spain','Sri Lanka','Sudan','Sweden','Switzerland','Syria','Tanzania','Thailand','Tunisia','Turkey','Uganda','Ukraine','United Kingdom','United States','Venezuela','Vietnam','Yemen','Zimbabwe','Other'];

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

  useEffect(() => {
    api.get('/profile').then(r => {
      const d = r.data;
      setForm(prev => ({
        ...prev,
        first_name: d.first_name || '', last_name: d.last_name || '', phone: d.phone || '',
        date_of_birth: d.date_of_birth?.split('T')[0] || '', gender: d.gender || '',
        nationality: d.nationality || '', marital_status: d.marital_status || '',
        address: d.address || '', city: d.city || '', country: d.country || '',
        passport_number: d.passport_number || '',
        passport_issue_date: d.passport_issue_date?.split('T')[0] || '',
        passport_expiry_date: d.passport_expiry_date?.split('T')[0] || '',
        education_level: d.education_level || '', institution_name: d.institution_name || '',
        program: d.program || '', graduation_year: d.graduation_year || '',
        current_occupation: d.current_occupation || '', employer_name: d.employer_name || '',
        years_of_experience: d.years_of_experience || '', previous_employers: d.previous_employers || '',
      }));
    }).catch(() => {}).finally(() => setFetching(false));
  }, []);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/profile', form);
      updateUser({ first_name: form.first_name, last_name: form.last_name });
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="flex items-center justify-center h-64"><div className="w-10 h-10 border-4 border-navy-800 border-t-transparent rounded-full animate-spin" /></div>;

  const Field = ({ label, name, type = 'text', opts, required }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}{required && ' *'}</label>
      {opts ? (
        <select value={form[name]} onChange={e => set(name, e.target.value)} className="input-field">
          <option value="">Select...</option>
          {opts.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : type === 'textarea' ? (
        <textarea rows={3} value={form[name]} onChange={e => set(name, e.target.value)} className="input-field resize-none" />
      ) : (
        <input type={type} value={form[name]} onChange={e => set(name, e.target.value)} className="input-field" />
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold text-navy-900 mb-1">My Profile</h1>
        <p className="text-gray-500 text-sm">Complete your profile to strengthen your application</p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="card">
          <h2 className="text-lg font-semibold text-navy-900 mb-4 flex items-center gap-2"><User className="w-5 h-5 text-navy-600" />Personal Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="First Name" name="first_name" required />
            <Field label="Last Name" name="last_name" required />
            <Field label="Phone Number" name="phone" type="tel" />
            <Field label="Date of Birth" name="date_of_birth" type="date" />
            <Field label="Gender" name="gender" opts={['Male', 'Female', 'Non-binary', 'Prefer not to say']} />
            <Field label="Nationality" name="nationality" />
            <Field label="Marital Status" name="marital_status" opts={['Single', 'Married', 'Divorced', 'Widowed']} />
          </div>
        </div>

        {/* Contact */}
        <div className="card">
          <h2 className="text-lg font-semibold text-navy-900 mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2"><Field label="Address" name="address" /></div>
            <Field label="City" name="city" />
            <Field label="Country" name="country" opts={countries} />
          </div>
        </div>

        {/* Passport */}
        <div className="card">
          <h2 className="text-lg font-semibold text-navy-900 mb-4">Passport Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Passport Number" name="passport_number" />
            <Field label="Issue Date" name="passport_issue_date" type="date" />
            <Field label="Expiry Date" name="passport_expiry_date" type="date" />
          </div>
        </div>

        {/* Education */}
        <div className="card">
          <h2 className="text-lg font-semibold text-navy-900 mb-4">Education</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Education Level" name="education_level" opts={['High School','Diploma','Associate Degree','Bachelor\'s Degree','Master\'s Degree','PhD','Vocational/Trade Certificate','Other']} />
            <Field label="Institution Name" name="institution_name" />
            <Field label="Program / Field of Study" name="program" />
            <Field label="Graduation Year" name="graduation_year" type="number" />
          </div>
        </div>

        {/* Work Experience */}
        <div className="card">
          <h2 className="text-lg font-semibold text-navy-900 mb-4">Work Experience</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Current Occupation" name="current_occupation" />
            <Field label="Current/Last Employer" name="employer_name" />
            <Field label="Years of Experience" name="years_of_experience" type="number" />
            <div className="sm:col-span-2"><Field label="Previous Employers" name="previous_employers" type="textarea" /></div>
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Save className="w-5 h-5" />Save Profile</>}
        </button>
      </form>
    </div>
  );
}
