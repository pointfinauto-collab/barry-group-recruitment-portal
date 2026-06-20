const { pool } = require('../config/database');

const calculateCompletion = (profile) => {
  const fields = [
    'date_of_birth', 'gender', 'nationality', 'marital_status',
    'address', 'city', 'country', 'passport_number',
    'passport_expiry_date', 'education_level', 'current_occupation'
  ];
  const filled = fields.filter(f => profile[f]).length;
  return Math.round((filled / fields.length) * 100);
};

const getProfile = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.id, u.first_name, u.last_name, u.email, u.phone, u.country, u.created_at,
              ap.*
       FROM users u
       LEFT JOIN applicant_profiles ap ON u.id = ap.user_id
       WHERE u.id = $1`,
      [req.user.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const {
      first_name, last_name, phone,
      date_of_birth, gender, nationality, marital_status,
      address, city, country,
      passport_number, passport_issue_date, passport_expiry_date,
      education_level, institution_name, program, graduation_year,
      current_occupation, employer_name, years_of_experience, previous_employers
    } = req.body;

    await pool.query(
      'UPDATE users SET first_name=$1, last_name=$2, phone=$3, updated_at=NOW() WHERE id=$4',
      [first_name, last_name, phone, req.user.id]
    );

    const profileData = {
      date_of_birth, gender, nationality, marital_status,
      address, city, country,
      passport_number, passport_issue_date, passport_expiry_date,
      education_level, institution_name, program, graduation_year,
      current_occupation, employer_name, years_of_experience, previous_employers
    };

    const completion = calculateCompletion(profileData);

    const existing = await pool.query('SELECT id FROM applicant_profiles WHERE user_id = $1', [req.user.id]);

    if (existing.rows.length) {
      await pool.query(
        `UPDATE applicant_profiles SET
         date_of_birth=$1, gender=$2, nationality=$3, marital_status=$4,
         address=$5, city=$6, country=$7,
         passport_number=$8, passport_issue_date=$9, passport_expiry_date=$10,
         education_level=$11, institution_name=$12, program=$13, graduation_year=$14,
         current_occupation=$15, employer_name=$16, years_of_experience=$17, previous_employers=$18,
         profile_completion=$19, updated_at=NOW()
         WHERE user_id=$20`,
        [...Object.values(profileData), completion, req.user.id]
      );
    } else {
      await pool.query(
        `INSERT INTO applicant_profiles (user_id, date_of_birth, gender, nationality, marital_status, address, city, country, passport_number, passport_issue_date, passport_expiry_date, education_level, institution_name, program, graduation_year, current_occupation, employer_name, years_of_experience, previous_employers, profile_completion)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)`,
        [req.user.id, ...Object.values(profileData), completion]
      );
    }

    res.json({ message: 'Profile updated successfully', completion });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};

module.exports = { getProfile, updateProfile };
