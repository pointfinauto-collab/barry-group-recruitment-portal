import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Save, CheckCircle } from 'lucide-react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const countries = [
  // ── AFRICA ──
  'Algeria','Angola','Benin','Botswana','Burkina Faso','Burundi','Cameroon',
  'Cape Verde','Central African Republic','Chad','Comoros','Congo','Côte d\'Ivoire',
  'Djibouti','DR Congo','Egypt','Equatorial Guinea','Eritrea','Eswatini','Ethiopia',
  'Gabon','Gambia','Ghana','Guinea','Guinea-Bissau','Kenya','Lesotho','Liberia',
  'Libya','Madagascar','Malawi','Mali','Mauritania','Mauritius','Morocco',
  'Mozambique','Namibia','Niger','Nigeria','Rwanda','São Tomé and Príncipe',
  'Senegal','Seychelles','Sierra Leone','Somalia','South Africa','South Sudan',
  'Sudan','Tanzania','Togo','Tunisia','Uganda','Zambia','Zimbabwe',

  // ── MIDDLE EAST ──
  'Bahrain','Iran','Iraq','Israel','Jordan','Kuwait','Lebanon','Oman',
  'Palestine','Qatar','Saudi Arabia','Syria','United Arab Emirates (UAE)',
  'Yemen',

  // ── ASIA ──
  'Afghanistan','Armenia','Azerbaijan','Bangladesh','Bhutan','Brunei','Cambodia',
  'China','Cyprus','Georgia','India','Indonesia','Japan','Kazakhstan','Kyrgyzstan',
  'Laos','Malaysia','Maldives','Mongolia','Myanmar','Nepal','North Korea',
  'Pakistan','Philippines','Singapore','South Korea','Sri Lanka','Taiwan',
  'Tajikistan','Thailand','Timor-Leste','Turkmenistan','Uzbekistan','Vietnam',

  // ── EUROPE ──
  'Albania','Andorra','Austria','Belarus','Belgium','Bosnia and Herzegovina',
  'Bulgaria','Croatia','Czech Republic','Denmark','Estonia','Finland','France',
  'Germany','Greece','Hungary','Iceland','Ireland','Italy','Kosovo','Latvia',
  'Liechtenstein','Lithuania','Luxembourg','Malta','Moldova','Monaco','Montenegro',
  'Netherlands','North Macedonia','Norway','Poland','Portugal','Romania','Russia',
  'San Marino','Serbia','Slovakia','Slovenia','Spain','Sweden','Switzerland',
  'Turkey','Ukraine','United Kingdom','Vatican City',

  // ── AMERICAS ──
  'Antigua and Barbuda','Argentina','Bahamas','Barbados','Belize','Bolivia',
  'Brazil','Canada','Chile','Colombia','Costa Rica','Cuba','Dominica',
  'Dominican Republic','Ecuador','El Salvador','Grenada','Guatemala','Guyana',
  'Haiti','Honduras','Jamaica','Mexico','Nicaragua','Panama','Paraguay','Peru',
  'Saint Kitts and Nevis','Saint Lucia','Saint Vincent and the Grenadines',
  'Suriname','Trinidad and Tobago','United States','Uruguay','Venezuela',

  // ── OCEANIA ──
  'Australia','Fiji','Kiribati','Marshall Islands','Micronesia','Nauru',
  'New Zealand','Palau','Papua New Guinea','Samoa','Solomon Islands','Tonga',
  'Tuvalu','Vanuatu',

  'Other',
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
const graduationYears = Array.from({ length: 55 }, (_, i) => currentYear - i);

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

  const Label = ({ text, required }) => (
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {text} {required && <span className="text-red-500">*</span>}
    </label>
  );

  const CountrySelect = ({ name, placeholder }) => (
    <select
      value={form[name]}
      onChange={e => set(name, e.target.value)}
      className="input-field bg-white cursor-pointer"
    >
      <option value="">{placeholder}</option>
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
        <option value="Cape Verde">Cape Verde</option>
        <option value="Central African Republic">Central African Republic</option>
        <option value="Chad">Chad</option>
        <option value="Comoros">Comoros</option>
        <option value="Congo">Congo</option>
        <option value="Côte d'Ivoire">Côte d'Ivoire</option>
        <option value="Djibouti">Djibouti</option>
        <option value="DR Congo">DR Congo</option>
        <option value="Egypt">Egypt</option>
        <option value="Equatorial Guinea">Equatorial Guinea</option>
        <option value="Eritrea">Eritrea</option>
        <option value="Eswatini">Eswatini</option>
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
        <option value="North Korea">North Korea</option>
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
        <option value="Andorra">Andorra</option>
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
        <option value="Kosovo">Kosovo</option>
        <option value="Latvia">Latvia</option>
        <option value="Lithuania">Lithuania</option>
        <option value="Luxembourg">Luxembourg</option>
        <option value="Malta">Malta</option>
        <option value="Moldova">Moldova</option>
        <option value="Monaco">Monaco</option>
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
        <option value="Antigua and Barbuda">Antigua and Barbuda</option>
        <option value="Argentina">Argentina</option>
        <option value="Bahamas">Bahamas</option>
        <option value="Barbados">Barbados</option>
        <option value="Belize">Belize</option>
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
        <option value="Guyana">Guyana</option>
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
  );

  const SimpleSelect = ({ name, placeholder, options }) => (
    <select
      value={form[name]}
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
              Complete your profile using the dropdowns and date pickers below.
            </p>
          </div>
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

        {/* ── SECTION 1: PERSONAL INFORMATION ── */}
        <div className="card">
          <h2 className="text-base font-semibold text-navy-900 mb-4 pb-3 border-b border-gray-100 flex items-center gap-2">
            <span className="w-7 h-7 bg-navy-800 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
            Personal Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label text="First Name" required />
              <input type="text" value={form.first_name}
                onChange={e => set('first_name', e.target.value)}
                placeholder="Enter your first name" className="input-field" required />
            </div>
            <div>
              <Label text="Last Name" required />
              <input type="text" value={form.last_name}
                onChange={e => set('last_name', e.target.value)}
                placeholder="Enter your last name" className="input-field" required />
            </div>
            <div>
              <Label text="Phone Number" />
              <input type="tel" value={form.phone}
                onChange={e => set('phone', e.target.value)}
                placeholder="+1 234 567 8900" className="input-field" />
              <p className="text-xs text-gray-400 mt-1">Include country code e.g. +966 50 000 0000</p>
            </div>
            <div>
              <Label text="Date of Birth" />
              <input type="date" value={form.date_of_birth}
                onChange={e => set('date_of_birth', e.target.value)}
                max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                min="1940-01-01" className="input-field" />
              <p className="text-xs text-gray-400 mt-1">Click the field to open date picker</p>
            </div>
            <div>
              <Label text="Gender" />
              <SimpleSelect name="gender" placeholder="-- Select Gender --" options={genders} />
            </div>
            <div>
              <Label text="Marital Status" />
              <SimpleSelect name="marital_status" placeholder="-- Select Marital Status --" options={maritalStatuses} />
            </div>
            <div>
              <Label text="Nationality" />
              <CountrySelect name="nationality" placeholder="-- Select Your Nationality --" />
            </div>
          </div>
        </div>

        {/* ── SECTION 2: CONTACT INFORMATION ── */}
        <div className="card">
          <h2 className="text-base font-semibold text-navy-900 mb-4 pb-3 border-b border-gray-100 flex items-center gap-2">
            <span className="w-7 h-7 bg-navy-800 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
            Contact Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Label text="Street Address" />
              <input type="text" value={form.address}
                onChange={e => set('address', e.target.value)}
                placeholder="123 Main Street, Apartment 4B" className="input-field" />
            </div>
            <div>
              <Label text="City / Town" />
              <input type="text" value={form.city}
                onChange={e => set('city', e.target.value)}
                placeholder="Enter your city or town" className="input-field" />
            </div>
            <div>
              <Label text="Country of Residence" />
              <CountrySelect name="country" placeholder="-- Select Your Country --" />
            </div>
          </div>
        </div>

        {/* ── SECTION 3: PASSPORT INFORMATION ── */}
        <div className="card">
          <h2 className="text-base font-semibold text-navy-900 mb-4 pb-3 border-b border-gray-100 flex items-center gap-2">
            <span className="w-7 h-7 bg-navy-800 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
            Passport Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label text="Passport Number" />
              <input type="text" value={form.passport_number}
                onChange={e => set('passport_number', e.target.value.toUpperCase())}
                placeholder="e.g. A12345678"
                className="input-field font-mono tracking-widest" maxLength={20} />
              <p className="text-xs text-gray-400 mt-1">Auto-converts to uppercase</p>
            </div>
            <div>
              <Label text="Issue Date" />
              <input type="date" value={form.passport_issue_date}
                onChange={e => set('passport_issue_date', e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                min="2000-01-01" className="input-field" />
              <p className="text-xs text-gray-400 mt-1">Date passport was issued</p>
            </div>
            <div>
              <Label text="Expiry Date" />
              <input type="date" value={form.passport_expiry_date}
                onChange={e => set('passport_expiry_date', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                max="2040-12-31" className="input-field" />
              <p className="text-xs text-gray-400 mt-1">Must be valid for 6+ months</p>
            </div>
          </div>
        </div>

        {/* ── SECTION 4: EDUCATION ── */}
        <div className="card">
          <h2 className="text-base font-semibold text-navy-900 mb-4 pb-3 border-b border-gray-100 flex items-center gap-2">
            <span className="w-7 h-7 bg-navy-800 text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
            Education
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label text="Highest Education Level" />
              <SimpleSelect name="education_level"
                placeholder="-- Select Education Level --"
                options={educationLevels} />
            </div>
            <div>
              <Label text="Graduation Year" />
              <SimpleSelect name="graduation_year"
                placeholder="-- Select Year --"
                options={graduationYears.map(y => ({ value: String(y), label: String(y) }))} />
            </div>
            <div>
              <Label text="Institution / School Name" />
              <input type="text" value={form.institution_name}
                onChange={e => set('institution_name', e.target.value)}
                placeholder="Name of school or university" className="input-field" />
            </div>
            <div>
              <Label text="Program / Field of Study" />
              <input type="text" value={form.program}
                onChange={e => set('program', e.target.value)}
                placeholder="e.g. Business Administration" className="input-field" />
            </div>
          </div>
        </div>

        {/* ── SECTION 5: WORK EXPERIENCE ── */}
        <div className="card">
          <h2 className="text-base font-semibold text-navy-900 mb-4 pb-3 border-b border-gray-100 flex items-center gap-2">
            <span className="w-7 h-7 bg-navy-800 text-white rounded-full flex items-center justify-center text-xs font-bold">5</span>
            Work Experience
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label text="Current Occupation / Job Title" />
              <input type="text" value={form.current_occupation}
                onChange={e => set('current_occupation', e.target.value)}
                placeholder="e.g. Fish Processing Worker" className="input-field" />
            </div>
            <div>
              <Label text="Current / Last Employer Name" />
              <input type="text" value={form.employer_name}
                onChange={e => set('employer_name', e.target.value)}
                placeholder="Company or organization name" className="input-field" />
            </div>
            <div>
              <Label text="Total Years of Experience" />
              <SimpleSelect name="years_of_experience"
                placeholder="-- Select Years of Experience --"
                options={experienceOptions} />
            </div>
            <div className="sm:col-span-2">
              <Label text="Previous Employers (Optional)" />
              <textarea rows={3} value={form.previous_employers}
                onChange={e => set('previous_employers', e.target.value)}
                placeholder="List your previous employers and roles&#10;Example: ABC Company — Warehouse Worker (2019–2021)&#10;XYZ Factory — Packer (2021–2023)"
                className="input-field resize-none" />
            </div>
          </div>
        </div>

        {/* ── TIPS ── */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">💡 Tips for Filling Your Profile</h3>
          <ul className="text-xs text-blue-700 space-y-1.5">
            <li>🌍 <strong>Country & Nationality</strong> — Middle East countries appear first in the dropdown list</li>
            <li>📅 <strong>Dates</strong> — Click the date field and a calendar will appear to pick the date</li>
            <li>🔠 <strong>Passport Number</strong> — Automatically converts to uppercase as you type</li>
            <li>📋 <strong>Dropdowns</strong> — All options are grouped by region for easy finding</li>
            <li>💾 <strong>Save</strong> — Click the Save Profile button at the bottom when done</li>
          </ul>
        </div>

        {/* ── SAVE BUTTON ── */}
        <div className="flex items-center gap-4 pb-8">
          <button type="submit" disabled={loading} className="btn-primary px-10 py-3 text-base">
            {loading
              ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <><Save className="w-5 h-5" /> Save Profile</>
            }
          </button>
          {completion === 100 && (
            <div className="flex items-center gap-2 text-green-600 font-medium">
              <CheckCircle className="w-5 h-5" /> Profile 100% Complete!
            </div>
          )}
          {completion > 0 && completion < 100 && (
            <p className="text-sm text-gray-500">{completion}% complete — fill all fields to reach 100%</p>
          )}
        </div>

      </form>
    </div>
  );
}
