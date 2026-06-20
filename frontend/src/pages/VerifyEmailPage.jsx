// VerifyEmailPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Fish, Mail, RefreshCw, ArrowRight } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function VerifyEmailPage() {
  const [params] = useSearchParams();
  const email = params.get('email') || '';
  const [code, setCode] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const navigate = useNavigate();

  const handleChange = (i, val) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...code];
    next[i] = val.slice(-1);
    setCode(next);
    if (val && i < 3) document.getElementById(`code-${i + 1}`)?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !code[i] && i > 0) document.getElementById(`code-${i - 1}`)?.focus();
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const fullCode = code.join('');
    if (fullCode.length !== 4) { toast.error('Please enter the 4-digit code'); return; }
    setLoading(true);
    try {
      await api.post('/auth/verify-email', { email, code: fullCode });
      toast.success('Email verified! You can now log in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid code');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await api.post('/auth/resend-verification', { email });
      toast.success('New verification code sent!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 justify-center mb-8">
            <div className="w-12 h-12 bg-gold rounded-xl flex items-center justify-center">
              <Fish className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-white font-display font-bold text-2xl leading-none">Barry Group Inc.</p>
              <p className="text-blue-400 text-xs">Email Verification</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-navy-700" />
            </div>
            <h2 className="text-2xl font-display font-bold text-navy-900 mb-2">Verify Your Email</h2>
            <p className="text-gray-500 mb-2">We sent a 4-digit code to</p>
            <p className="font-semibold text-navy-700 mb-8">{email}</p>

            <form onSubmit={handleSubmit}>
              <div className="flex gap-3 justify-center mb-8">
                {code.map((digit, i) => (
                  <input key={i} id={`code-${i}`} type="text" maxLength={1} value={digit}
                    onChange={e => handleChange(i, e.target.value)}
                    onKeyDown={e => handleKeyDown(i, e)}
                    className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-200 rounded-xl focus:outline-none focus:border-navy-600 transition-colors" />
                ))}
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5 mb-4">
                {loading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <>Verify Email <ArrowRight className="w-5 h-5" /></>}
              </button>
            </form>

            <button onClick={handleResend} disabled={resending} className="flex items-center gap-2 text-navy-600 hover:text-navy-800 text-sm font-medium mx-auto transition-colors">
              <RefreshCw className={`w-4 h-4 ${resending ? 'animate-spin' : ''}`} />
              {resending ? 'Sending...' : 'Resend Code'}
            </button>
          </div>

          <p className="text-center text-navy-400 text-sm mt-6">
            <Link to="/login" className="hover:text-white transition-colors">← Back to Sign In</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
