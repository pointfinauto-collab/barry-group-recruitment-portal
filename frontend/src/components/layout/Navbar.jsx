import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/jobs', label: 'View Jobs' },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-navy-950/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-2">
            <img src="/barry_group_logo.jpg" alt="Barry Group Inc." className="h-12 w-12 rounded-lg object-cover" />
            <div>
              <span className="text-white font-display font-bold text-xl leading-none">Barry Group</span>
              <p className="text-blue-300 text-xs">Inc. — Canada</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to}
                className={`text-sm font-medium transition-colors ${location.pathname === link.to ? 'text-yellow-400' : 'text-blue-100 hover:text-white'}`}>
                {link.label}
              </Link>
            ))}
            {user ? (
              <div className="flex items-center gap-4">
                <Link to={['admin','superadmin'].includes(user.role) ? '/admin' : '/dashboard'}
                  className="text-sm font-medium text-blue-100 hover:text-white transition-colors">
                  Dashboard
                </Link>
                <button onClick={logout} className="btn-primary text-sm py-2 px-4">Sign Out</button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-medium text-blue-100 hover:text-white transition-colors">Sign In</Link>
                <Link to="/register" className="btn-primary text-sm py-2.5 px-5">Request Job Offer</Link>
              </div>
            )}
          </div>

          <button onClick={() => setOpen(!open)} className="md:hidden text-white p-2">
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-navy-950 border-t border-navy-800">
            <div className="px-4 py-6 space-y-4">
              {navLinks.map(link => (
                <Link key={link.to} to={link.to} onClick={() => setOpen(false)}
                  className="block text-blue-100 hover:text-white py-2 font-medium">{link.label}</Link>
              ))}
              {user ? (
                <>
                  <Link to={['admin','superadmin'].includes(user.role) ? '/admin' : '/dashboard'} onClick={() => setOpen(false)}
                    className="block text-blue-100 hover:text-white py-2 font-medium">Dashboard</Link>
                  <button onClick={() => { logout(); setOpen(false); }} className="btn-primary w-full justify-center">Sign Out</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setOpen(false)} className="block text-blue-100 hover:text-white py-2 font-medium">Sign In</Link>
                  <Link to="/register" onClick={() => setOpen(false)} className="btn-primary w-full justify-center">Request Job Offer</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
