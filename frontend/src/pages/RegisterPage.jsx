import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Fish, Mail, Lock, Eye, EyeOff, User, Phone, Globe, ArrowRight, CheckCircle } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const countries = [
  // ── MIDDLE EAST ──
  'Bahrain',
  'Iran',
  'Iraq',
  'Israel',
  'Jordan',
  'Kuwait',
  'Lebanon',
  'Oman',
  'Palestine',
  'Qatar',
  'Saudi Arabia',
  'Syria',
  'United Arab Emirates (UAE)',
  'Yemen',
  // ── AFRICA ──
  'Algeria','Angola','Benin','Botswana','Burkina Faso','Burundi','Cameroon',
  'Cape Verde','Central African Republic','Chad','Comoros','Congo',
  "Côte d'Ivoire",'Djibouti','DR Congo','Egypt','Equatorial Guinea',
  'Eritrea','Eswatini','Ethiopia','Gabon','Gambia','Ghana','Guinea',
  'Guinea-Bissau','Kenya','Lesotho','Liberia','Libya','Madagascar',
  'Malawi','Mali','Mauritania','Mauritius','Morocco','Mozambique',
  'Namibia','Niger','Nigeria','Rwanda','Senegal','Seychelles',
  'Sierra Leone','Somalia','South Africa','South Sudan','Sudan',
  'Tanzania','Togo','Tunisia','Uganda','Zambia','Zimbabwe',
  // ── ASIA ──
  'Afghanistan','Armenia','Azerbaijan','Bangladesh','Bhutan','Brunei',
  'Cambodia','China','Cyprus','Georgia','India','Indonesia','Japan',
  'Kazakhstan','Kyrgyzstan','Laos','Malaysia','Maldives','Mongolia',
  'Myanmar','Nepal','North Korea','Pakistan','Philippines','Singapore',
  'South Korea','Sri Lanka','Taiwan','Tajikistan','Thailand','Timor-Leste',
  'Turkmenistan','Uzbekistan','Vietnam',
  // ── EUROPE ──
  'Albania','Andorra','Austria','Belarus','Belgium',
  'Bosnia and Herzegovina','Bulgaria','Croatia','Czech Republic',
  'Denmark','Estonia','Finland','France','Germany','Greece','Hungary',
  'Iceland','Ireland','Italy','Kosovo','Latvia','Lithuania','Luxembourg',
  'Malta','Moldova','Monaco','Montenegro','Netherlands','North Macedonia',
  'Norway','Poland','Portugal','Romania','Russia','Serbia','Slovakia',
  'Slovenia','Spain','Sweden','Switzerland','Turkey','Ukraine',
  'United Kingdom',
  // ── AMERICAS ──
  'Antigua and Barbuda','Argentina','Bahamas','Barbados','Belize',
  'Bolivia','Brazil','Canada','Chile','Colombia','Costa Rica','Cuba',
  'Dominican Republic','Ecuador','El Salvador','Guatemala','Guyana',
  'Haiti','Honduras','Jamaica','Mexico','Nicaragua','Panama','Paraguay',
  'Peru','Trinidad and Tobago','United States','Uruguay','Venezuela',
  // ── OCEANIA ──
  'Australia','Fiji','New Zealand','Papua New Guinea','Samoa',
  'Other',
];

export default function RegisterPage() {
  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '',
    phone: '', country: '', password: '', confirm_password: ''
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm_password) {
      toast.error('Passwords do not match');
      return;
    }
    if (form.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/register', {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        phone: form.phone,
        country: form.country,
        password: form.password,
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
            <img src="/barry_group_logo.jpg" alt="Barry Group Inc."
              className="h-12 w-12 rounded-lg object-cover" />
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
                    <input type="text" required placeholder="John"
                      value={form.first_name} onChange={e => set('first_name', e.target.value)}
                      className="input-field pl-10 text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name *</label>
                  <input type="text" required placeholder="Doe"
                    value={form.last_name} onChange={e => set('last_name', e.target.value)}
                    className="input-field text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="email" required placeholder="john@example.com"
                    value={form.email} onChange={e => set('email', e.target.value)}
                    className="input-field pl-12" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="tel" placeholder="+971 50 000 0000"
                    value={form.phone} onChange={e => set('phone', e.target.value)}
                    className="input-field pl-12" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Country of Residence *</label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                  <select required value={form.country}
                    onChange={e => set('country', e.target.value)}
                    className="input-field pl-12 appearance-none bg-white cursor-pointer">
                    <option value="">-- Select your country --</option>
                    <optgroup label="── MIDDLE EAST ──">
                      <option value="Bahrain">Bahrain</option>
                      <option value="Iran">Iran</option>
                      <option value="Iraq">Iraq</option>
                      <option value="Israel">Israel</option>
                      <option value="Jordan">Jordan</option>
                      <option value="Kuwait">Kuwait</option>
                      <option value="Lebanon">Lebanon</option>
                      <option value="Oman">Oman</option>
                      <option value="Palestine">Palestine</option>
                      <option value="Qatar">Qatar</option>
                      <option value="Saudi Arabia">Saudi Arabia</option>
                      <option value="Syria">Syria</option>
                      <option value="United Arab Emirates (UAE)">United Arab Emirates (UAE)</option>
                      <option value="Yemen">Yemen</option>
                    </optgroup>
                    <optgroup label="── AFRICA ──">
                      <option value="Algeria">Algeria</option>
                      <option value="Angola">Angola</option>
                      <option value="Benin">Benin</option>
                      <option value="Botswana">Botswana</option>
                      <option value="Burkina Faso">Burkina Faso</option>
                      <option value="Burundi">Burundi</option>
                      <option value="Cameroon">Cameroon</option>
                      <option value="Central African Republic">Central African Republic</option>
                      <option value="Chad">Chad</option>
                      <option value="Congo">Congo</option>
                      <option value="Côte d'Ivoire">Côte d'Ivoire</option>
                      <option value="DR Congo">DR Congo</option>
                      <option value="Djibouti">Djibouti</option>
                      <option value="Egypt">Egypt</option>
                      <option value="Eritrea">Eritrea</option>
                      <option value="Ethiopia">Ethiopia</option>
                      <option value="Gabon">Gabon</option>
                      <option value="Gambia">Gambia</option>
                      <option value="Ghana">Ghana</option>
                      <option value="Guinea">Guinea</option>
                      <option value="Guinea-Bissau">Guinea-Bissau</option>
                      <option value="Kenya">Kenya</option>
                      <option value="Lesotho">Lesotho</option>
                      <option value="Liberia">Liberia</option>
                      <option value="Libya">Libya</option>
                      <option value="Madagascar">Madagascar</option>
                      <option value="Malawi">Malawi</option>
                      <option value="Mali">Mali</option>
                      <option value="Mauritania">Mauritania</option>
                      <option value="Mauritius">Mauritius</option>
                      <option value="Morocco">Morocco</option>
                      <option value="Mozambique">Mozambique</option>
                      <option value="Namibia">Namibia</option>
                      <option value="Niger">Niger</option>
                      <option value="Nigeria">Nigeria</option>
                      <option value="Rwanda">Rwanda</option>
                      <option value="Senegal">Senegal</option>
                      <option value="Seychelles">Seychelles</option>
                      <option value="Sierra Leone">Sierra Leone</option>
                      <option value="Somalia">Somalia</option>
                      <option value="South Africa">South Africa</option>
                      <option value="South Sudan">South Sudan</option>
                      <option value="Sudan">Sudan</option>
                      <option value="Tanzania">Tanzania</option>
                      <option value="Togo">Togo</option>
                      <option value="Tunisia">Tunisia</option>
                      <option value="Uganda">Uganda</option>
                      <option value="Zambia">Zambia</option>
                      <option value="Zimbabwe">Zimbabwe</option>
                    </optgroup>
                    <optgroup label="── ASIA ──">
                      <option value="Afghanistan">Afghanistan</option>
                      <option value="Armenia">Armenia</option>
                      <option value="Azerbaijan">Azerbaijan</option>
                      <option value="Bangladesh">Bangladesh</option>
                      <option value="Bhutan">Bhutan</option>
                      <option value="Brunei">Brunei</option>
                      <option value="Cambodia">Cambodia</option>
                      <option value="China">China</option>
                      <option value="Cyprus">Cyprus</option>
                      <option value="Georgia">Georgia</option>
                      <option value="India">India</option>
                      <option value="Indonesia">Indonesia</option>
                      <option value="Japan">Japan</option>
                      <option value="Kazakhstan">Kazakhstan</option>
                      <option value="Kyrgyzstan">Kyrgyzstan</option>
                      <option value="Laos">Laos</option>
                      <option value="Malaysia">Malaysia</option>
                      <option value="Maldives">Maldives</option>
                      <option value="Mongolia">Mongolia</option>
                      <option value="Myanmar">Myanmar</option>
                      <option value="Nepal">Nepal</option>
                      <option value="Pakistan">Pakistan</option>
                      <option value="Philippines">Philippines</option>
                      <option value="Singapore">Singapore</option>
                      <option value="South Korea">South Korea</option>
                      <option value="Sri Lanka">Sri Lanka</option>
                      <option value="Taiwan">Taiwan</option>
                      <option value="Tajikistan">Tajikistan</option>
                      <option value="Thailand">Thailand</option>
                      <option value="Timor-Leste">Timor-Leste</option>
                      <option value="Turkmenistan">Turkmenistan</option>
                      <option value="Uzbekistan">Uzbekistan</option>
                      <option value="Vietnam">Vietnam</option>
                    </optgroup>
                    <optgroup label="── EUROPE ──">
                      <option value="Albania">Albania</option>
                      <option value="Austria">Austria</option>
                      <option value="Belarus">Belarus</option>
                      <option value="Belgium">Belgium</option>
                      <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
                      <option value="Bulgaria">Bulgaria</option>
                      <option value="Croatia">Croatia</option>
                      <option value="Czech Republic">Czech Republic</option>
                      <option value="Denmark">Denmark</option>
                      <option value="Estonia">Estonia</option>
                      <option value="Finland">Finland</option>
                      <option value="France">France</option>
                      <option value="Germany">Germany</option>
                      <option value="Greece">Greece</option>
                      <option value="Hungary">Hungary</option>
                      <option value="Iceland">Iceland</option>
                      <option value="Ireland">Ireland</option>
                      <option value="Italy">Italy</option>
                      <option value="Latvia">Latvia</option>
                      <option value="Lithuania">Lithuania</option>
                      <option value="Luxembourg">Luxembourg</option>
                      <option value="Malta">Malta</option>
                      <option value="Moldova">Moldova</option>
                      <option value="Montenegro">Montenegro</option>
                      <option value="Netherlands">Netherlands</option>
                      <option value="North Macedonia">North Macedonia</option>
                      <option value="Norway">Norway</option>
                      <option value="Poland">Poland</option>
                      <option value="Portugal">Portugal</option>
                      <option value="Romania">Romania</option>
                      <option value="Russia">Russia</option>
                      <option value="Serbia">Serbia</option>
                      <option value="Slovakia">Slovakia</option>
                      <option value="Slovenia">Slovenia</option>
                      <option value="Spain">Spain</option>
                      <option value="Sweden">Sweden</option>
                      <option value="Switzerland">Switzerland</option>
                      <option value="Turkey">Turkey</option>
                      <option value="Ukraine">Ukraine</option>
                      <option value="United Kingdom">United Kingdom</option>
                    </optgroup>
                    <optgroup label="── AMERICAS ──">
                      <option value="Argentina">Argentina</option>
                      <option value="Bolivia">Bolivia</option>
                      <option value="Brazil">Brazil</option>
                      <option value="Canada">Canada</option>
                      <option value="Chile">Chile</option>
                      <option value="Colombia">Colombia</option>
                      <option value="Costa Rica">Costa Rica</option>
                      <option value="Cuba">Cuba</option>
                      <option value="Dominican Republic">Dominican Republic</option>
                      <option value="Ecuador">Ecuador</option>
                      <option value="El Salvador">El Salvador</option>
                      <option value="Guatemala">Guatemala</option>
                      <option value="Haiti">Haiti</option>
                      <option value="Honduras">Honduras</option>
                      <option value="Jamaica">Jamaica</option>
                      <option value="Mexico">Mexico</option>
                      <option value="Nicaragua">Nicaragua</option>
                      <option value="Panama">Panama</option>
                      <option value="Paraguay">Paraguay</option>
                      <option value="Peru">Peru</option>
                      <option value="Trinidad and Tobago">Trinidad and Tobago</option>
                      <option value="United States">United States</option>
                      <option value="Uruguay">Uruguay</option>
                      <option value="Venezuela">Venezuela</option>
                    </optgroup>
                    <optgroup label="── OCEANIA ──">
                      <option value="Australia">Australia</option>
                      <option value="Fiji">Fiji</option>
                      <option value="New Zealand">New Zealand</option>
                      <option value="Papua New Guinea">Papua New Guinea</option>
                      <option value="Samoa">Samoa</option>
                    </optgroup>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password *</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type={showPass ? 'text' : 'password'} required minLength={8}
                    placeholder="Minimum 8 characters"
                    value={form.password} onChange={e => set('password', e.target.value)}
                    className="input-field pl-12 pr-12" />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password *</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="password" required placeholder="Repeat password"
                    value={form.confirm_password} onChange={e => set('confirm_password', e.target.value)}
                    className="input-field pl-12" />
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-700 flex gap-3">
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>After registration, a 4-digit verification code will be sent to your email. Please check your inbox.</span>
              </div>

              <button type="submit" disabled={loading}
                className="btn-primary w-full justify-center py-3.5 text-base">
                {loading
                  ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <>Create Account <ArrowRight className="w-5 h-5" /></>
                }
              </button>
            </form>

            <p className="text-center text-sm text-gray-600 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-navy-700 font-semibold hover:text-navy-900">Sign In</Link>
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
