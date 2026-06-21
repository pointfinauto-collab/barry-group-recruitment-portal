const PDFDocument = require('pdfkit');
const fs = require('fs');

// Barry Group Logo embedded as base64
const LOGO_BASE64 = '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';

const generateEmployerID = () => `EMP${Math.floor(10000000 + Math.random() * 90000000)}`;
const generateLMIARef = () => `LM${new Date().getFullYear()}${Math.floor(10000 + Math.random() * 90000)}`;

const generateOfferLetter = (application, user, profile, lmiaNumber) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 50, bufferPages: true });
      const chunks = [];
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const pageWidth = doc.page.width;
      const margin = 50;
      const contentWidth = pageWidth - margin * 2;
      const today = new Date().toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' });
      const employerID = generateEmployerID();
      const lmiaRef = lmiaNumber || generateLMIARef();
      const appNumber = application.application_number || 'N/A';
      const fullName = `${user.first_name} ${user.last_name}`;
      const logoBuffer = Buffer.from(LOGO_BASE64, 'base64');

      // ─── COLOR PALETTE ───
      const DARK_BLUE = '#1a3a5c';
      const MID_BLUE = '#2d6a9f';
      const LIGHT_BLUE = '#e8f0f8';
      const RED = '#cc0000';
      const GRAY = '#555555';
      const LIGHT_GRAY = '#f5f7fa';
      const BORDER = '#d0dce8';

      // ─── HEADER ───
      // Top blue bar
      doc.rect(0, 0, pageWidth, 8).fill(DARK_BLUE);

      // Logo
      doc.image(logoBuffer, margin, 20, { width: 80, height: 75 });

      // Company info right side
      doc.fontSize(16).fillColor(DARK_BLUE).font('Helvetica-Bold')
        .text('Barry Group Inc.', margin + 95, 22, { width: contentWidth - 95, align: 'right' });
      doc.fontSize(8).fillColor(GRAY).font('Helvetica')
        .text('415 Griffin Dr, Corner Brook, NL A2H 3E9, Canada', margin + 95, 42, { width: contentWidth - 95, align: 'right' })
        .text('barrygroup.ltd.inc@gmail.com  |  www.barrygroup.ca', margin + 95, 54, { width: contentWidth - 95, align: 'right' })
        .text('Take Control. Plan to Succeed.', margin + 95, 66, { width: contentWidth - 95, align: 'right' });

      // Date
      doc.fontSize(8).fillColor(GRAY).font('Helvetica')
        .text(`Date of Issue: ${today}`, margin + 95, 80, { width: contentWidth - 95, align: 'right' });

      // Bottom header divider
      doc.rect(margin, 102, contentWidth, 2).fill(DARK_BLUE);
      doc.rect(margin, 104, contentWidth, 1).fill('#d97706');

      // ─── DOCUMENT TITLE ───
      doc.rect(margin, 115, contentWidth, 30).fill(DARK_BLUE);
      doc.fontSize(13).fillColor('#ffffff').font('Helvetica-Bold')
        .text('EMPLOYMENT OFFER LETTER', margin, 124, { width: contentWidth, align: 'center' });

      doc.rect(margin, 145, contentWidth, 18).fill(LIGHT_BLUE);
      doc.fontSize(8.5).fillColor(DARK_BLUE).font('Helvetica')
        .text(`Application Reference: ${appNumber}     |     Employer ID: ${employerID}     |     LMIA Reference: ${lmiaRef}`,
          margin, 150, { width: contentWidth, align: 'center' });

      let y = 175;

      // ─── HELPER FUNCTIONS ───
      const sectionHeader = (title) => {
        doc.rect(margin, y, contentWidth, 20).fill(DARK_BLUE);
        doc.fontSize(9.5).fillColor('#ffffff').font('Helvetica-Bold')
          .text(title, margin + 8, y + 5, { width: contentWidth - 16, lineBreak: false });
        y += 24;
      };

      const fieldRow = (label, value, x, w, rowY) => {
        doc.fontSize(7.5).fillColor('#888888').font('Helvetica-Bold')
          .text(label.toUpperCase(), x, rowY, { width: w, lineBreak: false });
        doc.fontSize(9).fillColor('#111111').font('Helvetica')
          .text(value || 'N/A', x, rowY + 12, { width: w, lineBreak: false });
      };

      const twoColRow = (l1, v1, l2, v2, height = 36) => {
        const half = contentWidth / 2 - 6;
        doc.rect(margin, y, contentWidth, height).fill(LIGHT_GRAY);
        doc.rect(margin, y, contentWidth, height).lineWidth(0.5).stroke(BORDER);
        fieldRow(l1, v1, margin + 8, half - 8, y + 4);
        fieldRow(l2, v2, margin + half + 12, half - 8, y + 4);
        y += height + 2;
      };

      const oneColRow = (label, value, height = 28) => {
        doc.rect(margin, y, contentWidth, height).fill(LIGHT_GRAY);
        doc.rect(margin, y, contentWidth, height).lineWidth(0.5).stroke(BORDER);
        fieldRow(label, value, margin + 8, contentWidth - 16, y + 4);
        y += height + 2;
      };

      // ─── 1. EMPLOYEE INFORMATION ───
      sectionHeader('1.  EMPLOYEE INFORMATION');
      twoColRow('Full Legal Name', fullName, 'Passport Number', profile?.passport_number || 'N/A');
      twoColRow('Email Address', user.email || 'N/A', 'Phone Number', user.phone || 'N/A');
      twoColRow('City / Country', `${profile?.city || ''} ${profile?.country || ''}`.trim() || 'N/A', 'Nationality', profile?.nationality || 'N/A');
      oneColRow('Current Residential Address', profile?.address ? `${profile.address}, ${profile.city || ''}, ${profile.country || ''}` : 'N/A');
      y += 4;

      // ─── 2. EMPLOYMENT OFFER DETAILS ───
      sectionHeader('2.  EMPLOYMENT OFFER DETAILS');
      twoColRow('Job Title / Position', application.desired_position || 'N/A', 'Department', application.department || 'To Be Assigned');
      twoColRow('NOC Code', '7736', 'Employment Type', 'Full-Time, Permanent');
      twoColRow('Work Location', `${application.preferred_province || 'Newfoundland and Labrador'}, Canada`, 'Expected Start Date', 'To Be Confirmed Upon Acceptance');
      twoColRow('Reporting Supervisor', 'Emira J. Kadiric, CEO', 'Work Schedule', 'Monday – Friday');
      twoColRow('Hours Per Week', '40 Hours', 'Probation Period', '3 Months');
      y += 4;

      // ─── 3. COMPENSATION AND BENEFITS ───
      sectionHeader('3.  COMPENSATION AND BENEFITS');
      twoColRow('Annual Salary', 'CAD $36,000 – $85,000 per Year', 'Overtime Rate', '1.5x Regular Rate (after 40 hrs/week)');
      twoColRow('Vacation Entitlement', '2 Weeks Paid (10 Business Days)', 'Health Benefits', 'Comprehensive Health Coverage');
      twoColRow('Dental Benefits', 'Full Dental Coverage Included', 'Pension / Retirement', 'Company Pension Plan Eligible After 1 Year');
      oneColRow('Additional Benefits', 'Housing Assistance, Relocation Support, Professional Development, Safety Training');
      y += 4;

      // ─── 4. JOB DUTIES ───
      sectionHeader('4.  JOB DUTIES & RESPONSIBILITIES');
      const duties = [
        '• Perform assigned duties in accordance with company standards and Canadian occupational health and safety regulations.',
        '• Maintain high quality and productivity standards on the production floor or assigned department.',
        '• Follow all workplace safety protocols and wear required personal protective equipment at all times.',
        '• Report to the designated supervisor and communicate any workplace concerns promptly.',
        '• Participate in mandatory training programs, safety drills, and performance reviews.',
        '• Comply with all company policies, codes of conduct, and provincial employment standards.',
      ];
      doc.rect(margin, y, contentWidth, duties.length * 16 + 12).fill(LIGHT_GRAY);
      doc.rect(margin, y, contentWidth, duties.length * 16 + 12).lineWidth(0.5).stroke(BORDER);
      y += 6;
      duties.forEach(d => {
        doc.fontSize(8.5).fillColor('#111111').font('Helvetica')
          .text(d, margin + 8, y, { width: contentWidth - 16, lineBreak: false });
        y += 16;
      });
      y += 6;

      // ─── 5. LMIA SECTION ───
      sectionHeader('5.  LMIA INFORMATION');
      doc.rect(margin, y, contentWidth, 52).fill('#e8f4e8');
      doc.rect(margin, y, contentWidth, 52).lineWidth(0.5).stroke('#27ae60');
      doc.rect(margin, y, 4, 52).fill('#27ae60');
      const half = contentWidth / 2 - 6;
      fieldRow('LMIA Reference Number', lmiaRef, margin + 10, half, y + 4);
      fieldRow('LMIA Issue Date', today, margin + half + 16, half, y + 4);
      fieldRow('LMIA Expiry Date', '2026-12-31', margin + 10, half, y + 30);
      fieldRow('LMIA Status', 'Positive LMIA — Position Supported', margin + half + 16, half, y + 30);
      y += 56;
      doc.fontSize(7.5).fillColor('#2d7a3a').font('Helvetica-Oblique')
        .text(
          'LMIA reference numbers are given by Canadian federal work skill to Barry Group Inc. This does not constitute an official government visa, work permit, or immigration decision.',
          margin, y, { width: contentWidth }
        );
      y += 20;

      // ─── 6. TERMS AND CONDITIONS ───
      sectionHeader('6.  TERMS AND CONDITIONS');
      const terms = [
        '• PROBATION: Employment is subject to a 3-month probationary period during which performance will be evaluated.',
        '• CONFIDENTIALITY: The employee agrees to maintain confidentiality of all proprietary information and trade secrets.',
        '• WORKPLACE POLICIES: The employee must adhere to all Barry Group Inc. workplace policies and the Employee Handbook.',
        '• TERMINATION: Either party may terminate this agreement with 2 weeks written notice or payment in lieu thereof.',
        '• COMPLIANCE: This offer is governed by the Employment Standards Act of the applicable Canadian province.',
        '• BACKGROUND CHECK: This offer is contingent upon successful completion of a background verification process.',
      ];
      doc.rect(margin, y, contentWidth, terms.length * 16 + 12).fill(LIGHT_GRAY);
      doc.rect(margin, y, contentWidth, terms.length * 16 + 12).lineWidth(0.5).stroke(BORDER);
      y += 6;
      terms.forEach(t => {
        doc.fontSize(8.5).fillColor('#111111').font('Helvetica')
          .text(t, margin + 8, y, { width: contentWidth - 16, lineBreak: false });
        y += 16;
      });
      y += 10;

      // ─── 7. ACCEPTANCE SECTION ───
      sectionHeader('7.  ACCEPTANCE & SIGNATURES');
      doc.rect(margin, y, contentWidth, 100).fill(LIGHT_GRAY);
      doc.rect(margin, y, contentWidth, 100).lineWidth(0.5).stroke(BORDER);

      // Employer side
      doc.fontSize(8.5).fillColor(DARK_BLUE).font('Helvetica-Bold')
        .text('EMPLOYER REPRESENTATIVE', margin + 10, y + 8);
      doc.rect(margin + 10, y + 55, 160, 0.5).fill(GRAY);
      doc.fontSize(8.5).fillColor('#111111').font('Helvetica-Bold')
        .text('Emira J. Kadiric', margin + 10, y + 60);
      doc.fontSize(8).fillColor(GRAY).font('Helvetica')
        .text('Chief Executive Officer, Barry Group Inc.', margin + 10, y + 73)
        .text(`Date: ${today}`, margin + 10, y + 85);

      // Employee side
      doc.fontSize(8.5).fillColor(DARK_BLUE).font('Helvetica-Bold')
        .text('EMPLOYEE ACCEPTANCE', margin + contentWidth / 2 + 10, y + 8);
      doc.rect(margin + contentWidth / 2 + 10, y + 55, 160, 0.5).fill(GRAY);
      doc.fontSize(8.5).fillColor('#111111').font('Helvetica-Bold')
        .text(fullName, margin + contentWidth / 2 + 10, y + 60);
      doc.fontSize(8).fillColor(GRAY).font('Helvetica')
        .text('Applicant Signature', margin + contentWidth / 2 + 10, y + 73)
        .text('Date: ____________________', margin + contentWidth / 2 + 10, y + 85);

      y += 108;

      // ─── FOOTER ───
      const footerY = doc.page.height - 45;
      doc.rect(0, footerY, pageWidth, 45).fill(DARK_BLUE);
      doc.rect(0, footerY, pageWidth, 3).fill('#d97706');

      doc.fontSize(8).fillColor('#a8d8ea').font('Helvetica')
        .text('Barry Group Inc.  |  415 Griffin Dr, Corner Brook, NL A2H 3E9, Canada  |  barrygroup.ltd.inc@gmail.com',
          margin, footerY + 8, { width: contentWidth, align: 'center', lineBreak: false });
      doc.fontSize(7.5).fillColor('#6a9bbf')
        .text('This document is issued by Barry Group Inc. for employment purposes only. All information is provided by authorized users.',
          margin, footerY + 22, { width: contentWidth, align: 'center', lineBreak: false });

      // Page number
      const range = doc.bufferedPageRange();
      for (let i = 0; i < range.count; i++) {
        doc.switchToPage(range.start + i);
        doc.fontSize(7.5).fillColor('#6a9bbf')
          .text(`Page ${i + 1} of ${range.count}`, margin, footerY + 34,
            { width: contentWidth, align: 'right', lineBreak: false });
      }

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = { generateOfferLetter };
