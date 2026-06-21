const { pool } = require('../config/database');
const { generateOfferLetter } = require('../utils/offerLetter');
const path = require('path');
const fs = require('fs');

const generateAndSendOffer = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const result = await pool.query(
      `SELECT a.*, u.first_name, u.last_name, u.email, u.phone,
              ap.address, ap.city, ap.country,
              lr.lmia_number,
              j.title as job_title, j.department
       FROM applications a
       JOIN users u ON a.user_id = u.id
       LEFT JOIN applicant_profiles ap ON u.id = ap.user_id
       LEFT JOIN lmia_references lr ON a.id = lr.application_id
       LEFT JOIN jobs j ON a.job_id = j.id
       WHERE a.id = $1`,
      [applicationId]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const data = result.rows[0];

    if (data.status !== 'approved') {
      return res.status(400).json({ message: 'Offer letter can only be generated for approved applications' });
    }

    const user = {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      phone: data.phone,
    };

    const profile = {
      address: data.address,
      city: data.city,
      country: data.country,
    };

    const application = {
      application_number: data.application_number,
      desired_position: data.desired_position,
      department: data.department || data.job_title,
      preferred_province: data.preferred_province,
    };

    const pdfBuffer = await generateOfferLetter(application, user, profile, data.lmia_number);

    const fileName = `offer-letter-${data.application_number}.pdf`;
    const uploadDir = process.env.UPLOAD_PATH || './uploads';
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, pdfBuffer);

    const existing = await pool.query(
      "SELECT id FROM documents WHERE user_id = $1 AND document_type = 'offer_letter' AND application_id = $2",
      [data.user_id, applicationId]
    );

    if (!existing.rows.length) {
      await pool.query(
        `INSERT INTO documents (user_id, application_id, document_type, file_name, file_path, file_size, mime_type, status)
         VALUES ($1, $2, 'offer_letter', $3, $4, $5, 'application/pdf', 'approved')`,
        [data.user_id, applicationId, fileName, filePath, pdfBuffer.length]
      );
    } else {
      await pool.query(
        'UPDATE documents SET file_path = $1, file_size = $2 WHERE id = $3',
        [filePath, pdfBuffer.length, existing.rows[0].id]
      );
    }

    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: data.email,
      subject: `Job Offer Letter - ${data.application_number} | Barry Group Inc.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #0a2049; padding: 25px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: #fff; margin: 0;">Barry Group Inc.</h1>
            <p style="color: #a8d8ea; margin: 5px 0 0; font-size: 12px;">Take Control. Plan to Succeed.</p>
          </div>
          <div style="background: #fff; padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 8px 8px;">
            <h2 style="color: #0a2049;">Congratulations, ${data.first_name}!</h2>
            <p>Your application <strong>${data.application_number}</strong> has been approved.</p>
            <p>Your official Job Offer Letter is attached to this email as a PDF.</p>
            <div style="background: #f0f7ff; border-left: 4px solid #0a2049; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0;"><strong>Position:</strong> ${data.desired_position}</p>
              ${data.lmia_number ? `<p style="margin: 8px 0 0; color: #27ae60;"><strong>LMIA Reference:</strong> ${data.lmia_number}</p>` : ''}
            </div>
            <p>Please reply within 7 business days to accept this offer.</p>
            <p style="color: #999; font-size: 12px; margin-top: 20px;">
              Barry Group Inc. | 415 Griffin Dr, Corner Brook, NL A2H 3E9, Canada<br>
              barrygroup.ltd.inc@gmail.com
            </p>
          </div>
        </div>
      `,
      attachments: [{
        filename: fileName,
        content: pdfBuffer,
        contentType: 'application/pdf',
      }],
    });

    await pool.query(
      `INSERT INTO notifications (user_id, title, message, type)
       VALUES ($1, 'Offer Letter Ready', 'Your job offer letter has been sent to your email and is available for download in your dashboard.', 'success')`,
      [data.user_id]
    );

    res.json({ message: 'Offer letter generated and sent successfully', fileName });
  } catch (error) {
    console.error('Generate offer letter error:', error);
    res.status(500).json({ message: 'Failed to generate offer letter: ' + error.message });
  }
};

const downloadOfferLetter = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const result = await pool.query(
      `SELECT d.* FROM documents d
       JOIN applications a ON d.application_id = a.id
       WHERE d.application_id = $1
       AND d.document_type = 'offer_letter'
       AND a.user_id = $2`,
      [applicationId, req.user.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: 'Offer letter not found. Please contact admin.' });
    }

    const doc = result.rows[0];

    if (!fs.existsSync(doc.file_path)) {
      return res.status(404).json({ message: 'File not found. Please ask admin to regenerate.' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${doc.file_name}"`);
    res.send(fs.readFileSync(doc.file_path));
  } catch (error) {
    res.status(500).json({ message: 'Failed to download offer letter' });
  }
};

const previewOfferLetter = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const result = await pool.query(
      `SELECT * FROM documents WHERE application_id = $1 AND document_type = 'offer_letter'`,
      [applicationId]
    );
    if (!result.rows.length) {
      return res.json({ hasLetter: false });
    }
    res.json({
      hasLetter: true,
      fileName: result.rows[0].file_name,
      uploadedAt: result.rows[0].uploaded_at,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to check offer letter' });
  }
};

module.exports = { generateAndSendOffer, downloadOfferLetter, previewOfferLetter };
