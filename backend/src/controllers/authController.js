const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');
const { sendEmail } = require('../utils/email');

const generateCode = () => Math.floor(1000 + Math.random() * 9000).toString();

const register = async (req, res) => {
  const client = await pool.connect();
  try {
    const { first_name, last_name, email, phone, country, password } = req.body;

    const existing = await client.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const verificationCode = generateCode();
    const codeExpires = new Date(Date.now() + 15 * 60 * 1000);

    await client.query('BEGIN');

    const userResult = await client.query(
      `INSERT INTO users (first_name, last_name, email, phone, country, password_hash, verification_code, verification_code_expires)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
      [first_name, last_name, email, phone, country, passwordHash, verificationCode, codeExpires]
    );

    const userId = userResult.rows[0].id;

    await client.query(
      'INSERT INTO applicant_profiles (user_id) VALUES ($1)',
      [userId]
    );

    await client.query('COMMIT');

    await sendEmail(email, 'verification', `${first_name} ${last_name}`, verificationCode);

    res.status(201).json({
      message: 'Registration successful. Please check your email for verification code.',
      userId,
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Register error:', error);
    res.status(500).json({ message: 'Registration failed. Please try again.' });
  } finally {
    client.release();
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;

    const result = await pool.query(
      'SELECT id, verification_code, verification_code_expires FROM users WHERE email = $1',
      [email]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = result.rows[0];

    if (user.verification_code !== code) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    if (new Date() > new Date(user.verification_code_expires)) {
      return res.status(400).json({ message: 'Verification code expired. Please request a new one.' });
    }

    await pool.query(
      'UPDATE users SET is_email_verified = TRUE, verification_code = NULL, verification_code_expires = NULL WHERE id = $1',
      [user.id]
    );

    res.json({ message: 'Email verified successfully. You can now log in.' });
  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({ message: 'Verification failed' });
  }
};

const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    const result = await pool.query(
      'SELECT id, first_name, last_name, is_email_verified FROM users WHERE email = $1',
      [email]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = result.rows[0];

    if (user.is_email_verified) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    const code = generateCode();
    const expires = new Date(Date.now() + 15 * 60 * 1000);

    await pool.query(
      'UPDATE users SET verification_code = $1, verification_code_expires = $2 WHERE id = $3',
      [code, expires, user.id]
    );

    await sendEmail(email, 'verification', `${user.first_name} ${user.last_name}`, code);

    res.json({ message: 'Verification code resent to your email' });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ message: 'Failed to resend code' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (!result.rows.length) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = result.rows[0];

    if (!user.is_email_verified) {
      return res.status(401).json({
        message: 'Please verify your email before logging in',
        needsVerification: true,
        email,
      });
    }

    if (user.is_suspended) {
      return res.status(403).json({ message: 'Account suspended. Please contact support.' });
    }

    if (!user.is_active) {
      return res.status(403).json({ message: 'Account deactivated.' });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    await pool.query('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id]);

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const result = await pool.query(
      'SELECT id, first_name, last_name FROM users WHERE email = $1',
      [email]
    );

    // Always return success to prevent email enumeration
    if (!result.rows.length) {
      return res.json({ message: 'If that email exists, a reset code has been sent.' });
    }

    const user = result.rows[0];
    const code = generateCode();
    const expires = new Date(Date.now() + 15 * 60 * 1000);

    await pool.query(
      'UPDATE users SET reset_code = $1, reset_code_expires = $2 WHERE id = $3',
      [code, expires, user.id]
    );

    await sendEmail(email, 'passwordReset', `${user.first_name} ${user.last_name}`, code);

    res.json({ message: 'If that email exists, a reset code has been sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Failed to process request' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    const result = await pool.query(
      'SELECT id, reset_code, reset_code_expires FROM users WHERE email = $1',
      [email]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = result.rows[0];

    if (user.reset_code !== code) {
      return res.status(400).json({ message: 'Invalid reset code' });
    }

    if (new Date() > new Date(user.reset_code_expires)) {
      return res.status(400).json({ message: 'Reset code expired' });
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);

    await pool.query(
      'UPDATE users SET password_hash = $1, reset_code = NULL, reset_code_expires = NULL WHERE id = $2',
      [passwordHash, user.id]
    );

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Password reset failed' });
  }
};

const getMe = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.id, u.first_name, u.last_name, u.email, u.phone, u.country, u.role, u.last_login, u.created_at,
              ap.profile_completion, ap.date_of_birth, ap.gender, ap.nationality, ap.marital_status,
              ap.address, ap.city, ap.passport_number, ap.education_level, ap.current_occupation
       FROM users u
       LEFT JOIN applicant_profiles ap ON u.id = ap.user_id
       WHERE u.id = $1`,
      [req.user.id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
};

module.exports = { register, verifyEmail, resendVerification, login, forgotPassword, resetPassword, getMe };
