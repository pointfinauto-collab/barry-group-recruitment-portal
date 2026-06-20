const { pool } = require('../config/database');

const getPublishedJobs = async (req, res) => {
  try {
    const { department, search, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    let conditions = ['is_published = TRUE', 'is_active = TRUE'];
    let params = [];
    let idx = 1;

    if (department) {
      conditions.push(`department = $${idx++}`);
      params.push(department);
    }

    if (search) {
      conditions.push(`(title ILIKE $${idx} OR department ILIKE $${idx} OR description ILIKE $${idx})`);
      params.push(`%${search}%`);
      idx++;
    }

    const where = `WHERE ${conditions.join(' AND ')}`;

    const result = await pool.query(
      `SELECT * FROM jobs ${where} ORDER BY created_at DESC LIMIT $${idx} OFFSET $${idx + 1}`,
      [...params, limit, offset]
    );

    const countResult = await pool.query(`SELECT COUNT(*) FROM jobs ${where}`, params);

    res.json({
      jobs: result.rows,
      total: parseInt(countResult.rows[0].count),
      page: parseInt(page),
      totalPages: Math.ceil(countResult.rows[0].count / limit),
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ message: 'Failed to fetch jobs' });
  }
};

const getJobById = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM jobs WHERE id = $1 AND is_active = TRUE', [req.params.id]);
    if (!result.rows.length) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch job' });
  }
};

const getDepartments = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT DISTINCT department, COUNT(*) as count FROM jobs WHERE is_published = TRUE AND is_active = TRUE GROUP BY department ORDER BY department'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch departments' });
  }
};

// Admin CRUD
const createJob = async (req, res) => {
  try {
    const {
      title, department, location, employment_type,
      salary_min, salary_max, requirements, benefits,
      description, open_positions, is_published
    } = req.body;

    const result = await pool.query(
      `INSERT INTO jobs (title, department, location, employment_type, salary_min, salary_max, requirements, benefits, description, open_positions, is_published, created_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
      [title, department, location, employment_type, salary_min, salary_max, requirements, benefits, description, open_positions || 1, is_published || false, req.user.id]
    );

    res.status(201).json({ message: 'Job created successfully', job: result.rows[0] });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ message: 'Failed to create job' });
  }
};

const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title, department, location, employment_type,
      salary_min, salary_max, requirements, benefits,
      description, open_positions, is_published, is_active
    } = req.body;

    const result = await pool.query(
      `UPDATE jobs SET title=$1, department=$2, location=$3, employment_type=$4,
       salary_min=$5, salary_max=$6, requirements=$7, benefits=$8, description=$9,
       open_positions=$10, is_published=$11, is_active=$12, updated_at=NOW()
       WHERE id=$13 RETURNING *`,
      [title, department, location, employment_type, salary_min, salary_max,
       requirements, benefits, description, open_positions, is_published, is_active, id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json({ message: 'Job updated successfully', job: result.rows[0] });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({ message: 'Failed to update job' });
  }
};

const deleteJob = async (req, res) => {
  try {
    await pool.query('UPDATE jobs SET is_active = FALSE WHERE id = $1', [req.params.id]);
    res.json({ message: 'Job removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete job' });
  }
};

const getAllJobsAdmin = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT *, (SELECT COUNT(*) FROM applications WHERE job_id = jobs.id) as application_count FROM jobs ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch jobs' });
  }
};

module.exports = { getPublishedJobs, getJobById, getDepartments, createJob, updateJob, deleteJob, getAllJobsAdmin };
