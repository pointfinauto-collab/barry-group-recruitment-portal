const { pool } = require('../config/database');
const path = require('path');
const fs = require('fs');

const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { document_type, application_id } = req.body;

    const result = await pool.query(
      `INSERT INTO documents (user_id, application_id, document_type, file_name, file_path, file_size, mime_type)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        req.user.id,
        application_id || null,
        document_type,
        req.file.originalname,
        req.file.path,
        req.file.size,
        req.file.mimetype,
      ]
    );

    res.status(201).json({ message: 'Document uploaded successfully', document: result.rows[0] });
  } catch (error) {
    console.error('Upload document error:', error);
    res.status(500).json({ message: 'Failed to upload document' });
  }
};

const getMyDocuments = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM documents WHERE user_id = $1 ORDER BY uploaded_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch documents' });
  }
};

const deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM documents WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const doc = result.rows[0];

    // Delete file from disk
    if (fs.existsSync(doc.file_path)) {
      fs.unlinkSync(doc.file_path);
    }

    await pool.query('DELETE FROM documents WHERE id = $1', [id]);
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete document' });
  }
};

const downloadDocument = async (req, res) => {
  try {
    const { id } = req.params;
    let query = 'SELECT * FROM documents WHERE id = $1';
    let params = [id];

    if (req.user.role === 'applicant') {
      query += ' AND user_id = $2';
      params.push(req.user.id);
    }

    const result = await pool.query(query, params);

    if (!result.rows.length) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const doc = result.rows[0];

    if (!fs.existsSync(doc.file_path)) {
      return res.status(404).json({ message: 'File not found on server' });
    }

    res.download(doc.file_path, doc.file_name);
  } catch (error) {
    res.status(500).json({ message: 'Failed to download document' });
  }
};

// Admin
const getAllDocuments = async (req, res) => {
  try {
    const { user_id, status } = req.query;
    let conditions = [];
    let params = [];
    let idx = 1;

    if (user_id) { conditions.push(`d.user_id = $${idx++}`); params.push(user_id); }
    if (status) { conditions.push(`d.status = $${idx++}`); params.push(status); }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const result = await pool.query(
      `SELECT d.*, u.first_name, u.last_name, u.email
       FROM documents d JOIN users u ON d.user_id = u.id
       ${where} ORDER BY d.uploaded_at DESC`,
      params
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch documents' });
  }
};

const reviewDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, admin_notes } = req.body;

    await pool.query(
      'UPDATE documents SET status=$1, admin_notes=$2, reviewed_at=NOW(), reviewed_by=$3 WHERE id=$4',
      [status, admin_notes, req.user.id, id]
    );

    res.json({ message: 'Document reviewed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to review document' });
  }
};

module.exports = { uploadDocument, getMyDocuments, deleteDocument, downloadDocument, getAllDocuments, reviewDocument };
