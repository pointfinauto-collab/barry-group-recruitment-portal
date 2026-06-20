const { pool } = require('../config/database');

const getDashboardStats = async (req, res) => {
  try {
    const [users, apps, pending, approved, rejected, docs] = await Promise.all([
      pool.query("SELECT COUNT(*) FROM users WHERE role = 'applicant'"),
      pool.query('SELECT COUNT(*) FROM applications'),
      pool.query("SELECT COUNT(*) FROM applications WHERE status IN ('received','under_review','documents_required','shortlisted','employer_review')"),
      pool.query("SELECT COUNT(*) FROM applications WHERE status = 'approved'"),
      pool.query("SELECT COUNT(*) FROM applications WHERE status = 'rejected'"),
      pool.query("SELECT COUNT(*) FROM documents WHERE status = 'pending'"),
    ]);

    const recentApps = await pool.query(
      `SELECT a.application_number, a.status, a.submitted_at, a.desired_position,
              u.first_name, u.last_name, u.country
       FROM applications a JOIN users u ON a.user_id = u.id
       ORDER BY a.submitted_at DESC LIMIT 10`
    );

    const byStatus = await pool.query(
      `SELECT status, COUNT(*) as count FROM applications GROUP BY status`
    );

    res.json({
      stats: {
        total_users: parseInt(users.rows[0].count),
        total_applications: parseInt(apps.rows[0].count),
        pending_applications: parseInt(pending.rows[0].count),
        approved_applications: parseInt(approved.rows[0].count),
        rejected_applications: parseInt(rejected.rows[0].count),
        pending_documents: parseInt(docs.rows[0].count),
      },
      recent_applications: recentApps.rows,
      by_status: byStatus.rows,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    let params = [];
    let where = "WHERE u.role = 'applicant'";
    let idx = 1;

    if (search) {
      where += ` AND (u.first_name ILIKE $${idx} OR u.last_name ILIKE $${idx} OR u.email ILIKE $${idx})`;
      params.push(`%${search}%`);
      idx++;
    }

    const result = await pool.query(
      `SELECT u.id, u.first_name, u.last_name, u.email, u.phone, u.country,
              u.is_active, u.is_suspended, u.is_email_verified, u.last_login, u.created_at,
              ap.profile_completion,
              (SELECT COUNT(*) FROM applications WHERE user_id = u.id) as application_count
       FROM users u
       LEFT JOIN applicant_profiles ap ON u.id = ap.user_id
       ${where}
       ORDER BY u.created_at DESC
       LIMIT $${idx} OFFSET $${idx + 1}`,
      [...params, limit, offset]
    );

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM users u ${where}`,
      params
    );

    res.json({
      users: result.rows,
      total: parseInt(countResult.rows[0].count),
      page: parseInt(page),
      totalPages: Math.ceil(countResult.rows[0].count / limit),
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT u.*, ap.*
       FROM users u LEFT JOIN applicant_profiles ap ON u.id = ap.user_id
       WHERE u.id = $1`,
      [id]
    );

    if (!result.rows.length) return res.status(404).json({ message: 'User not found' });

    const docs = await pool.query('SELECT * FROM documents WHERE user_id = $1', [id]);
    const apps = await pool.query(
      `SELECT a.*, j.title as job_title, lr.lmia_number
       FROM applications a
       LEFT JOIN jobs j ON a.job_id = j.id
       LEFT JOIN lmia_references lr ON a.id = lr.application_id
       WHERE a.user_id = $1`, [id]
    );

    res.json({ user: result.rows[0], documents: docs.rows, applications: apps.rows });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user' });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body;

    const updates = {
      suspend: 'SET is_suspended = TRUE',
      unsuspend: 'SET is_suspended = FALSE',
      deactivate: 'SET is_active = FALSE',
      activate: 'SET is_active = TRUE',
    };

    if (!updates[action]) {
      return res.status(400).json({ message: 'Invalid action' });
    }

    await pool.query(`UPDATE users ${updates[action]} WHERE id = $1`, [id]);

    await pool.query(
      `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details)
       VALUES ($1, $2, 'user', $3, $4)`,
      [req.user.id, action, id, JSON.stringify({ action })]
    );

    res.json({ message: `User ${action}ed successfully` });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user' });
  }
};

module.exports = { getDashboardStats, getAllUsers, getUserById, updateUserStatus, deleteUser };
