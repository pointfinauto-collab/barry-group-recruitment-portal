const { pool } = require('../config/database');
const { sendEmail } = require('../utils/email');

const generateAppNumber = async () => {
  const year = new Date().getFullYear();
  const result = await pool.query("SELECT nextval('application_seq') as seq");
  const seq = result.rows[0].seq.toString().padStart(6, '0');
  return `APP-${year}-${seq}`;
};

const generateLMIANumber = async () => {
  // 7 digits starting with 8 — unique random number
  const digits = Math.floor(100000 + Math.random() * 900000);
  return `8${digits}`;
};

const submitApplication = async (req, res) => {
  const client = await pool.connect();
  try {
    const {
      job_id, desired_position, education_level,
      experience_years, country_of_residence, preferred_province, additional_info
    } = req.body;

    // Check existing application
    const existing = await client.query(
      'SELECT id FROM applications WHERE user_id = $1 AND status NOT IN ($2, $3)',
      [req.user.id, 'rejected', 'completed']
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({ message: 'You already have an active application.' });
    }

    const appNumber = await generateAppNumber();

    await client.query('BEGIN');

    const result = await client.query(
      `INSERT INTO applications (application_number, user_id, job_id, desired_position, education_level, experience_years, country_of_residence, preferred_province, additional_info)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [appNumber, req.user.id, job_id || null, desired_position, education_level, experience_years, country_of_residence, preferred_province, additional_info]
    );

    const app = result.rows[0];

    await client.query(
      `INSERT INTO application_status_history (application_id, status, notes)
       VALUES ($1, 'received', 'Application submitted by applicant')`,
      [app.id]
    );

    await client.query(
      `INSERT INTO notifications (user_id, title, message, type)
       VALUES ($1, 'Application Submitted', $2, 'success')`,
      [req.user.id, `Your application ${appNumber} has been submitted successfully.`]
    );

    await client.query('COMMIT');

    // Get user info for email
    const userResult = await pool.query('SELECT first_name, last_name, email FROM users WHERE id = $1', [req.user.id]);
    const user = userResult.rows[0];

    await sendEmail(user.email, 'applicationSubmitted', `${user.first_name} ${user.last_name}`, appNumber, desired_position);

    res.status(201).json({
      message: 'Application submitted successfully',
      application: app,
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Submit application error:', error);
    res.status(500).json({ message: 'Failed to submit application' });
  } finally {
    client.release();
  }
};

const getMyApplication = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.*, j.title as job_title, j.department,
              (SELECT json_agg(ash ORDER BY ash.created_at) FROM application_status_history ash WHERE ash.application_id = a.id) as status_history,
              lr.lmia_number
       FROM applications a
       LEFT JOIN jobs j ON a.job_id = j.id
       LEFT JOIN lmia_references lr ON a.id = lr.application_id
       WHERE a.user_id = $1
       ORDER BY a.submitted_at DESC`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({ message: 'Failed to fetch application' });
  }
};

const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT a.*, j.title as job_title, j.department, j.salary_min, j.salary_max,
              u.first_name, u.last_name, u.email, u.phone,
              lr.lmia_number,
              (SELECT json_agg(ash ORDER BY ash.created_at) FROM application_status_history ash WHERE ash.application_id = a.id) as status_history
       FROM applications a
       LEFT JOIN jobs j ON a.job_id = j.id
       LEFT JOIN users u ON a.user_id = u.id
       LEFT JOIN lmia_references lr ON a.id = lr.application_id
       WHERE a.id = $1`,
      [id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const app = result.rows[0];

    // Ensure applicant can only see their own
    if (req.user.role === 'applicant' && app.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(app);
  } catch (error) {
    console.error('Get application by id error:', error);
    res.status(500).json({ message: 'Failed to fetch application' });
  }
};

// Admin: Get all applications
const getAllApplications = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    let conditions = [];
    let params = [];
    let idx = 1;

    if (status) {
      conditions.push(`a.status = $${idx++}`);
      params.push(status);
    }

    if (search) {
      conditions.push(`(u.first_name ILIKE $${idx} OR u.last_name ILIKE $${idx} OR a.application_number ILIKE $${idx} OR u.email ILIKE $${idx})`);
      params.push(`%${search}%`);
      idx++;
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const result = await pool.query(
      `SELECT a.*, u.first_name, u.last_name, u.email, u.country,
              j.title as job_title, lr.lmia_number
       FROM applications a
       JOIN users u ON a.user_id = u.id
       LEFT JOIN jobs j ON a.job_id = j.id
       LEFT JOIN lmia_references lr ON a.id = lr.application_id
       ${where}
       ORDER BY a.submitted_at DESC
       LIMIT $${idx} OFFSET $${idx + 1}`,
      [...params, limit, offset]
    );

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM applications a JOIN users u ON a.user_id = u.id ${where}`,
      params
    );

    res.json({
      applications: result.rows,
      total: parseInt(countResult.rows[0].count),
      page: parseInt(page),
      totalPages: Math.ceil(countResult.rows[0].count / limit),
    });
  } catch (error) {
    console.error('Get all applications error:', error);
    res.status(500).json({ message: 'Failed to fetch applications' });
  }
};

// Admin: Update application status
const updateApplicationStatus = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const appResult = await client.query(
      'SELECT a.*, u.first_name, u.last_name, u.email FROM applications a JOIN users u ON a.user_id = u.id WHERE a.id = $1',
      [id]
    );

    if (!appResult.rows.length) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const app = appResult.rows[0];

    await client.query('BEGIN');

    await client.query(
      'UPDATE applications SET status = $1, updated_at = NOW() WHERE id = $2',
      [status, id]
    );

    await client.query(
      `INSERT INTO application_status_history (application_id, status, changed_by, notes)
       VALUES ($1, $2, $3, $4)`,
      [id, status, req.user.id, notes || null]
    );

    // Generate LMIA if approved
    if (status === 'approved') {
      const existing = await client.query('SELECT id FROM lmia_references WHERE application_id = $1', [id]);
      if (!existing.rows.length) {
        const lmiaNumber = await generateLMIANumber();
        await client.query(
          'INSERT INTO lmia_references (lmia_number, application_id, user_id, generated_by, notes) VALUES ($1, $2, $3, $4, $5)',
          [lmiaNumber, id, app.user_id, req.user.id, notes || null]
        );
      }
    }

    await client.query(
      `INSERT INTO notifications (user_id, title, message, type)
       VALUES ($1, 'Application Status Updated', $2, $3)`,
      [app.user_id, `Your application ${app.application_number} status changed to: ${status}`,
       status === 'approved' ? 'success' : status === 'rejected' ? 'error' : 'info']
    );

    await client.query('COMMIT');

    const statusLabels = {
      received: 'Application Received',
      under_review: 'Under Review',
      documents_required: 'Additional Documents Required',
      shortlisted: 'Shortlisted',
      employer_review: 'Employer Review',
      approved: 'Approved',
      rejected: 'Rejected',
      completed: 'Completed',
    };

    await sendEmail(
      app.email,
      'statusChange',
      `${app.first_name} ${app.last_name}`,
      app.application_number,
      statusLabels[status] || status,
      notes
    );

    res.json({ message: 'Status updated successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Update status error:', error);
    res.status(500).json({ message: 'Failed to update status' });
  } finally {
    client.release();
  }
};

module.exports = {
  submitApplication,
  getMyApplication,
  getApplicationById,
  getAllApplications,
  updateApplicationStatus,
};
