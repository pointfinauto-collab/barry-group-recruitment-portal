const { pool } = require('../config/database');

const sendMessage = async (req, res) => {
  try {
    const { recipient_id, application_id, subject, body, parent_id } = req.body;

    const result = await pool.query(
      `INSERT INTO messages (sender_id, recipient_id, application_id, subject, body, parent_id)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [req.user.id, recipient_id, application_id || null, subject, body, parent_id || null]
    );

    // Create notification for recipient
    await pool.query(
      `INSERT INTO notifications (user_id, title, message, type, link)
       VALUES ($1,$2,$3,'info','/dashboard/messages')`,
      [recipient_id, 'New Message', `You have a new message: ${subject}`]
    );

    res.status(201).json({ message: 'Message sent successfully', data: result.rows[0] });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Failed to send message' });
  }
};

const getInbox = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT m.*, 
              s.first_name as sender_first, s.last_name as sender_last,
              a.application_number
       FROM messages m
       JOIN users s ON m.sender_id = s.id
       LEFT JOIN applications a ON m.application_id = a.id
       WHERE m.recipient_id = $1 AND m.parent_id IS NULL
       ORDER BY m.created_at DESC`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch inbox' });
  }
};

const getThread = async (req, res) => {
  try {
    const { id } = req.params;

    // Get thread (original + replies)
    const result = await pool.query(
      `SELECT m.*,
              s.first_name as sender_first, s.last_name as sender_last
       FROM messages m
       JOIN users s ON m.sender_id = s.id
       WHERE m.id = $1 OR m.parent_id = $1
       ORDER BY m.created_at ASC`,
      [id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Mark as read
    await pool.query(
      'UPDATE messages SET is_read = TRUE WHERE (id = $1 OR parent_id = $1) AND recipient_id = $2',
      [id, req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch thread' });
  }
};

const getUnreadCount = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT COUNT(*) FROM messages WHERE recipient_id = $1 AND is_read = FALSE',
      [req.user.id]
    );
    res.json({ count: parseInt(result.rows[0].count) });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch count' });
  }
};

module.exports = { sendMessage, getInbox, getThread, getUnreadCount };
