import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Fish, Mail, Lock, Eye, EyeOff, User, Phone, Globe, ArrowRight, CheckCircle } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const countries = ['Afghanistan','Albania','Algeria','Argentina','Australia','Austria','Bangladesh','Belgium','Bolivia','Brazil','Cambodia','Canada','Chile','China','Colombia','Congo','Costa Rica','Croatia','Cuba','Czech Republic','Denmark','Dominican Republic','Ecuador','Egypt','El Salvador','Ethiopia','Finland','France','Germany','Ghana','Greece','Guatemala','Haiti','Honduras','Hungary','India','Indonesia','Iran','Iraq','Ireland','Israel','Italy','Jamaica','Japan','Jordan','Kenya','South Korea','Lebanon','Libya','Malaysia','Mexico','Morocco','Myanmar','Nepal','Netherlands','New Zealand','Nicaragua','Nigeria','Norway','Pakistan','Panama','Paraguay','Peru','Philippines','Poland','Portugal','Romania','Russia','Saudi Arabia','Senegal','Serbia','Sierra Leone','Somalia','South Africa','Spain','Sri Lanka','Sudan','Sweden','Switzerland','Syria','Tanzania','Thailand','Tunisia','Turkey','Uganda','Ukraine','United Kingdom','United States','Uruguay','Venezuela','Vietnam','Yemen','Zimbabwe','Other'];

export default function RegisterPage() {
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', phone: '', country: '', password: '', confirm_password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm_password) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 8) { toast.error('Password must be at least 8 characters'); return; }

    setLoading(true);
    try {
      await api.post('/auth/register', {
        first_name: form.first_name, last_name: form.last_name,
        email: form.email, phone: form.phone, country: form.country, password: form.password,
      });
      toast.success('Registration successful! Please verify your email.');
      navigate(`/verify-email?email=${encodeURIComponent(form.email)}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center p-4 py-16">
      <div className="w-full max-w-lg">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link to="/" className="flex items-center gap-3 justify-center mb-8">
            <div className="w-12 h-12 bg-gold rounded-xl flex items-center justify-center">
              <Fish className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-white font-display font-bold text-2xl leading-none">Barry Group Inc.</p>
              <p className="text-blue-400 text-xs">Create Your Account</p>
            </div>
          </Link>

          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <h2 className="text-2xl font-display font-bold text-navy-900 mb-2">Request Job Offer</h2>
            <p className="text-gray-500 mb-8">Create your account to apply for employment in Canada</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" required placeholder="John" value={form.first_name} onChange={e => set('first_name', e.target.value)} className="input-field pl-10 text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name *</label>
                  <input type="text" required placeholder="Doe" value={form.last_name} onChange={e => set('last_name', e.target.value)} className="input-field text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="email" required placeholder="john@example.com" value={form.email} onChange={e => set('email', e.target.value)} className="input-field pl-12" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="tel" placeholder="+1 234 567 8900" value={form.phone} onChange={e => set('phone', e.target.value)} className="input-field pl-12" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Country of Residence *</label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select required value={form.country} onChange={e => set('country', e.target.value)} className="input-field pl-12 appearance-none">
                    <option value="">Select country...</option>
                    {countries.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password *</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type={showPass ? 'text' : 'password'} required minLength={8} placeholder="Minimum 8 characters" value={form.password} onChange={e => set('password', e.target.value)} className="input-field pl-12 pr-12" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password *</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="password" required placeholder="Repeat password" value={form.confirm_password} onChange={e => set('confirm_password', e.target.value)} className="input-field pl-12" />
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-700 flex gap-3">
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>After registration, a 4-digit verification code will be sent to your email address. Please check your inbox.</span>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5 text-base">
                {loading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <>Create Account <ArrowRight className="w-5 h-5" /></>}
              </button>
            </form>

            <p className="text-center text-sm text-gray-600 mt-6">
              Already have an account? <Link to="/login" className="text-navy-700 font-semibold hover:text-navy-900">Sign In</Link>
            </p>
          </div>

          <p className="text-center text-navy-400 text-sm mt-6">
            <Link to="/" className="hover:text-white transition-colors">← Back to Home</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
