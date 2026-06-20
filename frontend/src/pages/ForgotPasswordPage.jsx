// ForgotPasswordPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Fish, Mail, ArrowRight } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
      toast.success('Reset code sent to your email');
      setTimeout(() => navigate(`/reset-password?email=${encodeURIComponent(email)}`), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 justify-center mb-8">
            <div className="w-12 h-12 bg-gold rounded-xl flex items-center justify-center"><Fish className="w-7 h-7 text-white" /></div>
            <div><p className="text-white font-display font-bold text-2xl leading-none">Barry Group Inc.</p><p className="text-blue-400 text-xs">Password Recovery</p></div>
          </div>
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <h2 className="text-2xl font-display font-bold text-navy-900 mb-2">Forgot Password?</h2>
            <p className="text-gray-500 mb-8">Enter your registered email to receive a reset code.</p>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" className="input-field pl-12" />
                </div>
              </div>
              <button type="submit" disabled={loading || sent} className="btn-primary w-full justify-center py-3.5">
                {loading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : sent ? 'Code Sent!' : <>Send Reset Code <ArrowRight className="w-5 h-5" /></>}
              </button>
            </form>
            <p className="text-center text-sm text-gray-600 mt-6">
              <Link to="/login" className="text-navy-700 font-semibold">← Back to Sign In</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
