import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-blue-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src="/barry_group_logo.jpg" alt="Barry Group Inc." className="h-14 w-14 rounded-xl object-cover" />
              <div>
                <span className="text-white font-display font-bold text-xl">Barry Group Inc.</span>
                <p className="text-blue-400 text-xs">Canadian Seafood Processing & Export</p>
                <p className="text-yellow-400 text-xs italic">Take Control. Plan to Succeed.</p>
              </div>
            </div>
            <p className="text-blue-300 text-sm leading-relaxed max-w-sm">
              A leading Canadian seafood processing and export company offering employment opportunities for skilled workers from around the world.
            </p>
            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                <span>415 Griffin Dr, Corner Brook, NL A2H 3E9, Canada</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                <span>barrygroup.ltd.inc@gmail.com</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[['/', 'Home'], ['/jobs', 'View Jobs'], ['/register', 'Apply Now'], ['/login', 'Sign In']].map(([to, label]) => (
                <li key={to}><Link to={to} className="hover:text-white transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Departments</h4>
            <ul className="space-y-2 text-sm">
              {['Seafood Processing', 'Packaging', 'Warehouse', 'Logistics', 'Quality Control', 'Administration'].map(d => (
                <li key={d}><Link to={`/jobs?department=${encodeURIComponent(d)}`} className="hover:text-white transition-colors">{d}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-navy-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-blue-400">
          <p>© {new Date().getFullYear()} Barry Group Inc. All rights reserved.</p>
          <p className="text-xs text-center text-blue-500">
            LMIA reference numbers are internal tracking numbers only and do not constitute official government immigration decisions.
          </p>
        </div>
      </div>
    </footer>
  );
}
