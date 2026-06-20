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

const emailTemplates = {
  verification: (name, code) => ({
    subject: 'Verify Your Email - Barry Group Inc.',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 30px; border-radius: 8px;">
        <div style="background: #1a3a5c; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: #fff; margin: 0; font-size: 24px;">Barry Group Inc.</h1>
          <p style="color: #a8d8ea; margin: 5px 0 0;">Canadian Seafood Processing & Export</p>
        </div>
        <div style="background: #fff; padding: 30px; border-radius: 0 0 8px 8px;">
          <h2 style="color: #1a3a5c;">Email Verification</h2>
          <p>Dear <strong>${name}</strong>,</p>
          <p>Thank you for registering with Barry Group Inc. Please use the verification code below to confirm your email address:</p>
          <div style="background: #f0f7ff; border: 2px solid #1a3a5c; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #1a3a5c; font-size: 40px; letter-spacing: 10px; margin: 0;">${code}</h1>
            <p style="color: #666; margin: 10px 0 0;">This code expires in 15 minutes</p>
          </div>
          <p>If you did not register for an account, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999; font-size: 12px;">Barry Group Inc. | Nova Scotia, Canada | recruitment@barrygroup.ca</p>
        </div>
      </div>
    `,
  }),

  passwordReset: (name, code) => ({
    subject: 'Password Reset - Barry Group Inc.',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 30px; border-radius: 8px;">
        <div style="background: #1a3a5c; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: #fff; margin: 0; font-size: 24px;">Barry Group Inc.</h1>
        </div>
        <div style="background: #fff; padding: 30px; border-radius: 0 0 8px 8px;">
          <h2 style="color: #1a3a5c;">Password Reset Request</h2>
          <p>Dear <strong>${name}</strong>,</p>
          <p>We received a request to reset your password. Use this code:</p>
          <div style="background: #fff8f0; border: 2px solid #e67e22; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #e67e22; font-size: 40px; letter-spacing: 10px; margin: 0;">${code}</h1>
            <p style="color: #666; margin: 10px 0 0;">Expires in 15 minutes</p>
          </div>
          <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
        </div>
      </div>
    `,
  }),

  applicationSubmitted: (name, appNumber, position) => ({
    subject: `Application Received - ${appNumber} | Barry Group Inc.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 30px; border-radius: 8px;">
        <div style="background: #1a3a5c; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: #fff; margin: 0; font-size: 24px;">Barry Group Inc.</h1>
          <p style="color: #a8d8ea; margin: 5px 0 0;">Canadian Seafood Processing & Export</p>
        </div>
        <div style="background: #fff; padding: 30px; border-radius: 0 0 8px 8px;">
          <h2 style="color: #1a3a5c;">✅ Application Received Successfully</h2>
          <p>Dear <strong>${name}</strong>,</p>
          <p>Your employment application has been received. Here are your application details:</p>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="background: #f0f7ff;">
              <td style="padding: 12px; font-weight: bold; border: 1px solid #ddd;">Application Number</td>
              <td style="padding: 12px; border: 1px solid #ddd; font-size: 18px; color: #1a3a5c;"><strong>${appNumber}</strong></td>
            </tr>
            <tr>
              <td style="padding: 12px; font-weight: bold; border: 1px solid #ddd;">Position Applied</td>
              <td style="padding: 12px; border: 1px solid #ddd;">${position}</td>
            </tr>
            <tr style="background: #f0f7ff;">
              <td style="padding: 12px; font-weight: bold; border: 1px solid #ddd;">Status</td>
              <td style="padding: 12px; border: 1px solid #ddd; color: #27ae60;"><strong>Application Received</strong></td>
            </tr>
          </table>
          <p>Our recruitment team will review your application and contact you within 5-10 business days. Please save your application number for future reference.</p>
          <p>You can track your application status by logging into your dashboard.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999; font-size: 12px;">Barry Group Inc. | Nova Scotia, Canada | recruitment@barrygroup.ca</p>
        </div>
      </div>
    `,
  }),

  statusChange: (name, appNumber, status, notes) => ({
    subject: `Application Status Update - ${appNumber} | Barry Group Inc.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 30px; border-radius: 8px;">
        <div style="background: #1a3a5c; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: #fff; margin: 0; font-size: 24px;">Barry Group Inc.</h1>
        </div>
        <div style="background: #fff; padding: 30px; border-radius: 0 0 8px 8px;">
          <h2 style="color: #1a3a5c;">Application Status Update</h2>
          <p>Dear <strong>${name}</strong>,</p>
          <p>Your application <strong>${appNumber}</strong> status has been updated to:</p>
          <div style="background: #f0f7ff; border-left: 4px solid #1a3a5c; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <h3 style="color: #1a3a5c; margin: 0;">${status}</h3>
          </div>
          ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
          <p>Log into your dashboard to view full details and any required actions.</p>
        </div>
      </div>
    `,
  }),

  documentRequest: (name, appNumber, documents) => ({
    subject: `Additional Documents Required - ${appNumber} | Barry Group Inc.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 30px; border-radius: 8px;">
        <div style="background: #1a3a5c; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: #fff; margin: 0; font-size: 24px;">Barry Group Inc.</h1>
        </div>
        <div style="background: #fff; padding: 30px; border-radius: 0 0 8px 8px;">
          <h2 style="color: #e67e22;">📄 Additional Documents Required</h2>
          <p>Dear <strong>${name}</strong>,</p>
          <p>For application <strong>${appNumber}</strong>, we require the following documents:</p>
          <ul style="background: #fff8f0; padding: 20px 30px; border-radius: 8px; border: 1px solid #f0a500;">
            ${documents.map(d => `<li style="margin: 8px 0;">${d}</li>`).join('')}
          </ul>
          <p>Please upload these documents to your dashboard as soon as possible to avoid delays in processing your application.</p>
        </div>
      </div>
    `,
  }),
};

const sendEmail = async (to, templateName, ...args) => {
  const template = emailTemplates[templateName](...args);
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject: template.subject,
    html: template.html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendEmail };
