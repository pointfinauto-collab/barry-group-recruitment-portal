import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Users, Award, Shield, TrendingUp, Heart, Globe, Star, ChevronDown, ArrowRight, CheckCircle } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const stats = [
  { value: '500+', label: 'Employees Worldwide' },
  { value: '18+', label: 'Job Categories' },
  { value: '25+', label: 'Years in Business' },
  { value: '40+', label: 'Countries Served' },
];

const benefits = [
  { icon: TrendingUp, title: 'Competitive Compensation', desc: 'Industry-leading salaries with CAD $36,000–$85,000+ annually plus overtime' },
  { icon: Award, title: 'Career Advancement', desc: 'Clear promotion pathways and professional development programs' },
  { icon: Shield, title: 'Safe Work Environment', desc: 'Rigorous health & safety protocols with ongoing training' },
  { icon: Star, title: 'Professional Training', desc: 'Comprehensive onboarding and skill development at no cost' },
  { icon: Globe, title: 'Diverse Workforce', desc: 'Inclusive workplace welcoming professionals from over 40 countries' },
  { icon: Users, title: 'Team Collaboration', desc: 'Strong team culture with mentorship and peer support programs' },
  { icon: Heart, title: 'Employee Benefits', desc: 'Health, dental, vision coverage and housing assistance' },
  { icon: CheckCircle, title: 'Long-Term Careers', desc: 'Stable employment with growth potential across all departments' },
];

const values = [
  { title: 'Integrity', desc: 'We operate with transparency and ethical standards in everything we do.' },
  { title: 'Excellence', desc: 'We pursue the highest quality in our products and workplace.' },
  { title: 'Safety First', desc: 'Every employee\'s wellbeing is our top priority, always.' },
  { title: 'Inclusion', desc: 'We celebrate diversity and foster an inclusive workplace culture.' },
];

export default function HomePage() {
  const [jobs, setJobs] = useState([]);
  const [jobCount, setJobCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    api.get('/jobs?limit=6').then(r => {
      setJobs(r.data.jobs || []);
      setJobCount(r.data.total || 0);
    }).catch(() => {});
  }, []);

  const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen bg-navy-950 flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-900 to-ocean/30" />
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-ocean/10 rounded-full blur-3xl" />
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 pt-40">
          <div className="max-w-3xl">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/30 rounded-full text-gold text-sm font-medium">
                Now Accepting Applications — {jobCount}+ Positions Available
              </span>
            </motion.div>

            <motion.h1
              initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-display text-white leading-tight mb-6"
            >
              Build Your<br />
              <span className="text-gold">Future</span> in<br />Canada
            </motion.h1>

            <motion.p
              initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.2 }}
              className="text-xl text-blue-200 mb-10 leading-relaxed max-w-xl"
            >
              Apply for employment opportunities with Barry Group Inc., a leading Canadian seafood processing and export company headquartered in Corner Brook, Newfoundland.
            </motion.p>

            {/* Hero Buttons — show based on login state */}
            <motion.div
              initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              {user ? (
                /* Logged in — show dashboard button only */
                <Link
                  to={['admin', 'superadmin'].includes(user.role) ? '/admin' : '/dashboard'}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-navy-950 font-bold rounded-xl transition-all duration-200 shadow-lg text-base"
                >
                  Go to Dashboard <ArrowRight className="w-5 h-5" />
                </Link>
              ) : (
                /* Not logged in — show Request Job Offer and Sign In */
                <>
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-navy-950 font-bold rounded-xl transition-all duration-200 shadow-lg text-base"
                  >
                    Request Job Offer <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    to="/jobs"
                    className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/30 text-white hover:bg-white/10 font-semibold rounded-xl transition-all duration-200 text-base"
                  >
                    View Available Jobs
                  </Link>
                  <Link
                    to="/login"
                    className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors text-base px-4 py-4"
                  >
                    Sign In →
                  </Link>
                </>
              )}
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map((s, i) => (
              <div key={i} className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                <div className="text-3xl font-display font-bold text-gold">{s.value}</div>
                <div className="text-blue-300 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-blue-400 animate-bounce">
          <ChevronDown className="w-6 h-6" />
        </div>
      </section>

      {/* About */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="text-gold font-semibold text-sm tracking-wider uppercase">About Barry Group Inc.</span>
              <h2 className="text-4xl font-display text-navy-900 mt-3 mb-6">Canada's Premier Seafood Processing Company</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Barry Group Inc. has been a cornerstone of Canada's seafood industry for over 25 years. Operating from our state-of-the-art facilities in Corner Brook, Newfoundland, we process and export premium seafood products to markets across North America, Europe, and Asia.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                We are committed to creating a diverse, inclusive, and safe workplace where every employee has the opportunity to grow, thrive, and build a rewarding long-term career in Canada.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {values.map((v, i) => (
                  <div key={i} className="p-4 bg-navy-50 rounded-xl">
                    <h4 className="font-semibold text-navy-800 mb-1">{v.title}</h4>
                    <p className="text-sm text-gray-600">{v.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="relative">
              <div className="bg-gradient-to-br from-navy-800 to-ocean rounded-3xl p-8 text-white">
                <div className="flex items-center gap-4 mb-6">
                  <img src="/barry_group_logo.jpg" alt="Barry Group" className="w-16 h-16 rounded-xl object-cover" />
                  <div>
                    <h3 className="text-xl font-display font-bold">Barry Group Inc.</h3>
                    <p className="text-blue-300 text-sm">Take Control. Plan to Succeed.</p>
                  </div>
                </div>
                <h3 className="text-2xl font-display mb-4">Our Mission</h3>
                <p className="text-blue-100 leading-relaxed mb-6">
                  To be Canada's most respected seafood employer — delivering premium quality products while building careers and supporting communities.
                </p>
                <h3 className="text-2xl font-display mb-4">Our Vision</h3>
                <p className="text-blue-100 leading-relaxed">
                  A global leader in sustainable seafood processing, powered by a diverse and dedicated workforce from around the world.
                </p>
                <div className="mt-6 pt-6 border-t border-white/20">
                  <div className="flex items-center gap-2 text-blue-200 text-sm">
                    <MapPin className="w-4 h-4 text-gold" />
                    <span>415 Griffin Dr, Corner Brook, NL A2H 3E9, Canada</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Work With Us */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="text-gold font-semibold text-sm tracking-wider uppercase">Employee Benefits</span>
            <h2 className="text-4xl font-display text-navy-900 mt-3 mb-4">Why Work With Barry Group?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We invest in our people. Here's what makes Barry Group Inc. one of Canada's top employers in the seafood industry.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="card hover:shadow-md transition-shadow group">
                <div className="w-12 h-12 bg-navy-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-navy-800 transition-colors">
                  <b.icon className="w-6 h-6 text-navy-800 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-semibold text-navy-900 mb-2">{b.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="text-gold font-semibold text-sm tracking-wider uppercase">Open Positions</span>
            <h2 className="text-4xl font-display text-navy-900 mt-3 mb-4">Current Employment Opportunities</h2>
            <p className="text-gray-600">Explore {jobCount}+ open positions across our facilities in Canada.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {jobs.map((job, i) => (
              <motion.div key={job.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="card hover:shadow-lg transition-all border-l-4 border-l-navy-800 group">
                <div className="flex justify-between items-start mb-3">
                  <span className="badge bg-navy-100 text-navy-700">{job.department}</span>
                  <span className="badge bg-green-100 text-green-700">{job.open_positions} Open</span>
                </div>
                <h3 className="font-display font-bold text-navy-900 text-lg mb-2 group-hover:text-gold transition-colors">{job.title}</h3>
                <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                  <MapPin className="w-4 h-4" /><span>{job.location}</span>
                </div>
                <div className="text-sm text-gray-600 mb-4">
                  <span className="font-medium text-navy-700">
                    CAD ${Number(job.salary_min).toLocaleString()} – ${Number(job.salary_max).toLocaleString()}/yr
                  </span>
                  <span className="mx-2 text-gray-300">|</span>
                  <span>{job.employment_type}</span>
                </div>
                {job.requirements && (
                  <p className="text-xs text-gray-500 mb-4 line-clamp-2">{job.requirements}</p>
                )}
                <Link to={user ? '/dashboard/application' : '/register'}
                  className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-navy-800 hover:bg-navy-700 text-white font-semibold rounded-lg transition-all text-sm">
                  Apply Now
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/jobs"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-navy-800 text-navy-800 hover:bg-navy-800 hover:text-white font-semibold rounded-lg transition-all duration-200">
              View All {jobCount} Positions <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-navy-950">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <img src="/barry_group_logo.jpg" alt="Barry Group" className="w-20 h-20 rounded-2xl object-cover mx-auto mb-6" />
            <h2 className="text-4xl font-display text-white mb-6">Ready to Start Your Canadian Journey?</h2>
            <p className="text-blue-200 text-lg mb-10 max-w-2xl mx-auto">
              Create your account today, complete your profile, and submit your application to one of our {jobCount}+ open positions. Our recruitment team reviews every application personally.
            </p>
            {!user && (
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/register"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-navy-950 font-bold rounded-xl transition-all text-base shadow-lg">
                  Create Your Account <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/jobs"
                  className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/30 text-white hover:bg-white/10 font-semibold rounded-xl transition-all text-base">
                  Browse All Jobs
                </Link>
              </div>
            )}
            {user && (
              <Link
                to={['admin', 'superadmin'].includes(user.role) ? '/admin' : '/dashboard'}
                className="inline-flex items-center gap-2 px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-navy-950 font-bold rounded-xl transition-all text-base shadow-lg">
                Go to Dashboard <ArrowRight className="w-5 h-5" />
              </Link>
            )}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
