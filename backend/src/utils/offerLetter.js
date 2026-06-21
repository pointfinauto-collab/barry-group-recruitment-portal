const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Logo embedded as base64 — never disappears on redeploy
const LOGO_BASE64 = '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';

const generateEmployerID = () => {
  const num = Math.floor(10000000 + Math.random() * 90000000);
  return `EMP${num}`;
};

const generateLMIARef = () => {
  const year = new Date().getFullYear();
  const seq = Math.floor(10000 + Math.random() * 90000);
  return `LM${year}${seq}`;
};

const generateOfferLetter = (application, user, profile, lmiaNumber) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 0, bufferPages: true });
      const chunks = [];
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const pageWidth = doc.page.width;
      const pageHeight = doc.page.height;
      const margin = 45;
      const contentWidth = pageWidth - margin * 2;
      const today = new Date().toLocaleDateString('en-CA', {
        year: 'numeric', month: 'long', day: 'numeric'
      });

      const employerID = generateEmployerID();
      const lmiaRef = lmiaNumber || generateLMIARef();
      const appNumber = application.application_number || 'N/A';
      const col1x = margin;
      const col2x = margin + contentWidth / 2;
      const colW = contentWidth / 2 - 8;

      // Convert base64 logo to buffer
      const logoBuffer = Buffer.from(LOGO_BASE64, 'base64');

      // ─── TOP BARCODE BAR ───
      doc.rect(0, 0, pageWidth, 22).fill('#000000');
      doc.fontSize(6).fillColor('#ffffff').font('Helvetica')
        .text(
          `||| ||| ||| ||| ||| ||| ||| |||    ${appNumber}    ||| ||| ||| ||| ||| ||| ||| |||`,
          margin, 8, { width: contentWidth, align: 'center' }
        );

      // ─── HEADER ───
      let y = 30;

      // Logo box with red border
      doc.rect(margin, y, 95, 60).lineWidth(1.5).stroke('#cc0000');
      doc.image(logoBuffer, margin + 3, y + 3, { width: 89, height: 54 });

      // Title
      doc.fontSize(18).fillColor('#1a3a5c').font('Helvetica-Bold')
        .text('Barry Group Inc.', margin + 105, y + 2);
      doc.fontSize(10).fillColor('#000000').font('Helvetica-Bold')
        .text('LABOUR MARKET IMPACT ASSESSMENT', margin + 105, y + 24);
      doc.fontSize(9).fillColor('#555555').font('Helvetica')
        .text('Employment Offer Confirmation Document', margin + 105, y + 38);

      // LMIA highlight bar
      doc.rect(margin + 105, y + 52, 290, 16).fill('#1a3a5c');
      doc.fontSize(10).fillColor('#ffffff').font('Helvetica-Bold')
        .text(`LMIA REFERENCE: ${lmiaRef}`, margin + 110, y + 55, { width: 280, lineBreak: false });
      y += 98;

      // ─── ANNEXA TITLE ───
      doc.rect(margin, y, contentWidth, 20).fill('#f0f0f0');
      doc.rect(margin, y, contentWidth, 1.5).fill('#1a3a5c');
      doc.fontSize(11).fillColor('#1a3a5c').font('Helvetica-Bold')
        .text('ANNEXA — OFFICIAL EMPLOYMENT OFFER', margin, y + 5,
          { width: contentWidth, align: 'center' });
      y += 26;

      // ─── SECTION: DOCUMENT INFORMATION ───
      doc.rect(margin, y, contentWidth, 18).fill('#1a3a5c');
      doc.fontSize(10).fillColor('#ffffff').font('Helvetica-Bold')
        .text('DOCUMENT INFORMATION', margin + 8, y + 4);
      y += 22;

      doc.rect(margin, y, contentWidth, 76).fill('#fafafa');
      doc.rect(margin, y, contentWidth, 76).lineWidth(0.5).stroke('#e0e0e0');
      y += 6;

      // Row 1
      doc.fontSize(8).fillColor('#666666').font('Helvetica-Bold')
        .text('SYSTEM FILE NUMBER', col1x + 8, y, { lineBreak: false });
      doc.fontSize(8).fillColor('#666666').font('Helvetica-Bold')
        .text('DATE ISSUED', col2x, y, { lineBreak: false });
      y += 11;
      doc.fontSize(9).fillColor('#000000').font('Helvetica')
        .text(appNumber, col1x + 8, y, { width: colW, lineBreak: false });
      doc.fontSize(9).fillColor('#000000').font('Helvetica')
        .text(today, col2x, y, { width: colW, lineBreak: false });
      y += 16;

      // Row 2
      doc.fontSize(8).fillColor('#666666').font('Helvetica-Bold')
        .text('SERVICE CENTER', col1x + 8, y, { lineBreak: false });
      doc.fontSize(8).fillColor('#666666').font('Helvetica-Bold')
        .text('OFFICE LOCATION', col2x, y, { lineBreak: false });
      y += 11;
      doc.fontSize(9).fillColor('#000000').font('Helvetica')
        .text('BARRY GROUP WORKER REQUIREMENT BRANCH', col1x + 8, y, { width: colW, lineBreak: false });
      doc.fontSize(9).fillColor('#000000').font('Helvetica')
        .text('CORNER BROOK, NL, CANADA', col2x, y, { width: colW, lineBreak: false });
      y += 16;

      // Row 3
      doc.fontSize(8).fillColor('#666666').font('Helvetica-Bold')
        .text('OPINION EXPIRY DATE', col1x + 8, y, { lineBreak: false });
      doc.fontSize(8).fillColor('#666666').font('Helvetica-Bold')
        .text('EMPLOYER ID', col2x, y, { lineBreak: false });
      y += 11;
      doc.fontSize(9).fillColor('#000000').font('Helvetica')
        .text('2026-12-31', col1x + 8, y, { width: colW, lineBreak: false });
      doc.fontSize(9).fillColor('#cc0000').font('Helvetica-Bold')
        .text(employerID, col2x, y, { width: colW, lineBreak: false });
      y += 18;

      doc.rect(margin + 4, y, contentWidth - 8, 0.5).fill('#dddddd');
      y += 6;
      doc.fontSize(7.5).fillColor('#555555').font('Helvetica-Oblique')
        .text(
          'Note: The Foreign Worker must apply to CIC for a work permit prior to the Opinion Expiry Date.',
          margin + 4, y, { width: contentWidth - 8, lineBreak: false }
        );
      y += 14;

      // ─── SECTION: EMPLOYER INFORMATION ───
      doc.rect(margin, y, contentWidth, 18).fill('#1a3a5c');
      doc.fontSize(10).fillColor('#ffffff').font('Helvetica-Bold')
        .text('EMPLOYER INFORMATION', margin + 8, y + 4);
      y += 22;

      doc.rect(margin, y, contentWidth, 62).fill('#fafafa');
      doc.rect(margin, y, contentWidth, 62).lineWidth(0.5).stroke('#e0e0e0');
      y += 6;

      doc.fontSize(8).fillColor('#666666').font('Helvetica-Bold')
        .text('EMPLOYER NAME', col1x + 8, y, { lineBreak: false });
      doc.fontSize(8).fillColor('#666666').font('Helvetica-Bold')
        .text('EMPLOYER ID', col2x, y, { lineBreak: false });
      y += 11;
      doc.fontSize(9).fillColor('#000000').font('Helvetica')
        .text('Barry Group Inc.', col1x + 8, y, { width: colW, lineBreak: false });
      doc.fontSize(9).fillColor('#cc0000').font('Helvetica-Bold')
        .text(employerID, col2x, y, { width: colW, lineBreak: false });
      y += 16;

      doc.fontSize(8).fillColor('#666666').font('Helvetica-Bold')
        .text('AUTHORIZED REPRESENTATIVE', col1x + 8, y, { lineBreak: false });
      doc.fontSize(8).fillColor('#666666').font('Helvetica-Bold')
        .text('DESIGNATION', col2x, y, { lineBreak: false });
      y += 11;
      doc.fontSize(9).fillColor('#000000').font('Helvetica')
        .text('Emira J. Kadiric', col1x + 8, y, { width: colW, lineBreak: false });
      doc.fontSize(9).fillColor('#000000').font('Helvetica')
        .text('Chief Executive Officer', col2x, y, { width: colW, lineBreak: false });
      y += 18;

      doc.fontSize(7.5).fillColor('#555555').font('Helvetica-Oblique')
        .text(
          'Please retain the Employer ID for future reference. It will be required for all future foreign worker requests.',
          margin + 4, y, { width: contentWidth - 8, lineBreak: false }
        );
      y += 14;

      // ─── SECTION: CONTRACT INFORMATION ───
      doc.rect(margin, y, contentWidth, 18).fill('#1a3a5c');
      doc.fontSize(10).fillColor('#ffffff').font('Helvetica-Bold')
        .text('CONTRACT INFORMATION', margin + 8, y + 4);
      y += 22;

      doc.rect(margin, y, contentWidth, 62).fill('#fafafa');
      doc.rect(margin, y, contentWidth, 62).lineWidth(0.5).stroke('#e0e0e0');
      y += 6;

      doc.fontSize(8).fillColor('#666666').font('Helvetica-Bold')
        .text('CONTRACT NAME / POSITION', col1x + 8, y, { lineBreak: false });
      doc.fontSize(8).fillColor('#666666').font('Helvetica-Bold')
        .text('THIRD PARTY ID', col2x, y, { lineBreak: false });
      y += 11;
      doc.fontSize(9).fillColor('#1a3a5c').font('Helvetica-Bold')
        .text(application.desired_position || 'As Discussed', col1x + 8, y, { width: colW, lineBreak: false });
      doc.fontSize(9).fillColor('#cc0000').font('Helvetica-Bold')
        .text(`TP${Math.floor(1000000 + Math.random() * 9000000)}`, col2x, y, { width: colW, lineBreak: false });
      y += 16;

      doc.fontSize(8).fillColor('#666666').font('Helvetica-Bold')
        .text('THIRD PARTY COMPANY', col1x + 8, y, { lineBreak: false });
      doc.fontSize(8).fillColor('#666666').font('Helvetica-Bold')
        .text('NAME OF REPRESENTATIVE', col2x, y, { lineBreak: false });
      y += 11;
      doc.fontSize(9).fillColor('#000000').font('Helvetica')
        .text('Barry Group Inc. & Associates', col1x + 8, y, { width: colW, lineBreak: false });
      doc.fontSize(9).fillColor('#000000').font('Helvetica')
        .text('Emira J. Kadiric', col2x, y, { width: colW, lineBreak: false });
      y += 18;

      doc.fontSize(7.5).fillColor('#555555').font('Helvetica-Oblique')
        .text(
          'Please retain this contract reference for all future foreign work or immigration-related requests.',
          margin + 4, y, { width: contentWidth - 8, lineBreak: false }
        );
      y += 14;

      // ─── SECTION: WORKER INFORMATION ───
      doc.rect(margin, y, contentWidth, 18).fill('#1a3a5c');
      doc.fontSize(10).fillColor('#ffffff').font('Helvetica-Bold')
        .text('WORKER INFORMATION', margin + 8, y + 4);
      y += 22;

      // Worker table header
      doc.rect(margin, y, contentWidth, 16).fill('#e8eef5');
      doc.fontSize(8.5).fillColor('#1a3a5c').font('Helvetica-Bold')
        .text('LAST NAME', margin + 8, y + 4, { width: 130, lineBreak: false });
      doc.text('FIRST NAME', margin + 158, y + 4, { width: 130, lineBreak: false });
      doc.text('PASSPORT NUMBER', margin + 308, y + 4, { width: 140, lineBreak: false });
      y += 16;

      // Worker data row
      doc.rect(margin, y, contentWidth, 18).fill('#ffffff');
      doc.rect(margin, y, contentWidth, 18).lineWidth(0.5).stroke('#e0e0e0');
      doc.fontSize(9).fillColor('#000000').font('Helvetica-Bold')
        .text(user.last_name?.toUpperCase() || 'N/A', margin + 8, y + 4, { width: 130, lineBreak: false });
      doc.text(user.first_name?.toUpperCase() || 'N/A', margin + 158, y + 4, { width: 130, lineBreak: false });
      doc.font('Helvetica')
        .text(profile?.passport_number || 'N/A', margin + 308, y + 4, { width: 140, lineBreak: false });
      y += 22;

      // Worker detail grid
      doc.rect(margin, y, contentWidth, 90).fill('#fafafa');
      doc.rect(margin, y, contentWidth, 90).lineWidth(0.5).stroke('#e0e0e0');
      y += 6;

      const wRows = [
        ['NATIONALITY', profile?.nationality || user.country || 'N/A', 'EMAIL ADDRESS', user.email || 'N/A'],
        ['PHONE NUMBER', user.phone || 'N/A', 'COUNTRY OF RESIDENCE', profile?.country || user.country || 'N/A'],
        ['EDUCATION LEVEL', profile?.education_level || 'As per profile', 'YEARS OF EXPERIENCE', `${application.experience_years || 'N/A'} Year(s)`],
        ['PREFERRED PROVINCE', application.preferred_province || 'Newfoundland and Labrador', 'NOC CODE', '7736'],
      ];

      wRows.forEach(([l1, v1, l2, v2]) => {
        doc.fontSize(8).fillColor('#666666').font('Helvetica-Bold')
          .text(l1, col1x + 8, y, { width: colW, lineBreak: false });
        doc.fontSize(8).fillColor('#666666').font('Helvetica-Bold')
          .text(l2, col2x, y, { width: colW, lineBreak: false });
        y += 11;
        doc.fontSize(9).fillColor('#000000').font('Helvetica')
          .text(v1, col1x + 8, y, { width: colW - 8, lineBreak: false });
        doc.fontSize(9).fillColor('#000000').font('Helvetica')
          .text(v2, col2x, y, { width: colW, lineBreak: false });
        y += 16;
      });

      y += 4;

      // ─── SECTION: EMPLOYMENT TERMS ───
      doc.rect(margin, y, contentWidth, 18).fill('#1a3a5c');
      doc.fontSize(10).fillColor('#ffffff').font('Helvetica-Bold')
        .text('EMPLOYMENT TERMS', margin + 8, y + 4);
      y += 22;

      doc.rect(margin, y, contentWidth, 90).fill('#fafafa');
      doc.rect(margin, y, contentWidth, 90).lineWidth(0.5).stroke('#e0e0e0');
      y += 6;

      const tRows = [
        ['POSITION TITLE', application.desired_position || 'N/A', 'EMPLOYMENT TYPE', 'Full-Time, Permanent'],
        ['ANNUAL SALARY', 'CAD $36,000 — $85,000 per Year', 'HOURS OF WORK', '40 Hours per Week'],
        ['BENEFITS', 'Health, Dental, Housing Assistance', 'PROBATION PERIOD', '3 Months'],
        ['WORK LOCATION', '415 Griffin Dr, Corner Brook, NL', 'LANGUAGE', 'English (Oral & Written)'],
      ];

      tRows.forEach(([l1, v1, l2, v2]) => {
        doc.fontSize(8).fillColor('#666666').font('Helvetica-Bold')
          .text(l1, col1x + 8, y, { width: colW, lineBreak: false });
        doc.fontSize(8).fillColor('#666666').font('Helvetica-Bold')
          .text(l2, col2x, y, { width: colW, lineBreak: false });
        y += 11;
        doc.fontSize(9).fillColor('#000000').font('Helvetica')
          .text(v1, col1x + 8, y, { width: colW - 8, lineBreak: false });
        doc.fontSize(9).fillColor('#000000').font('Helvetica')
          .text(v2, col2x, y, { width: colW, lineBreak: false });
        y += 16;
      });

      y += 4;

      // ─── LMIA REFERENCE BOX ───
      doc.rect(margin, y, contentWidth, 34).fill('#e8f4e8');
      doc.rect(margin, y, contentWidth, 34).lineWidth(0.5).stroke('#27ae60');
      doc.rect(margin, y, 4, 34).fill('#27ae60');
      doc.fontSize(9).fillColor('#1a5c2a').font('Helvetica-Bold')
        .text(`LMIA REFERENCE NUMBER:  ${lmiaRef}`, margin + 12, y + 6, { lineBreak: false });
      doc.fontSize(7.5).fillColor('#2d7a3a').font('Helvetica-Oblique')
        .text(
          'LMIA reference numbers are given by Canadian federal work skill to Barry Group Inc. They do not constitute official government immigration decisions and visas.',
          margin + 12, y + 20, { width: contentWidth - 20, lineBreak: false }
        );
      y += 40;

      // ─── FOOTNOTE ───
      doc.fontSize(7.5).fillColor('#555555').font('Helvetica-Oblique')
        .text(
          'Annex Foot note: This confirmation is valid only inside Canada.   Find NOC code: http://www.esdc.gc.ca',
          margin, y + 4, { width: contentWidth, lineBreak: false }
        );

      // ─── FOOTER FIXED AT BOTTOM ───
      const footerY = pageHeight - 52;
      doc.rect(0, footerY, pageWidth, 52).fill('#1a3a5c');

      doc.fontSize(9).fillColor('#ffffff').font('Helvetica-Bold')
        .text('Barry Group Inc.', margin, footerY + 6);
      doc.fontSize(7.5).fillColor('#a8d8ea').font('Helvetica')
        .text('415 Griffin Dr, Corner Brook, NL A2H 3E9, Canada', margin, footerY + 18);
      doc.text('barrygroup.ltd.inc@gmail.com', margin, footerY + 28);

      doc.fontSize(8).fillColor('#ffffff').font('Helvetica')
        .text('Page 1 of 1', margin, footerY + 36,
          { align: 'center', width: contentWidth, lineBreak: false });

      doc.fontSize(16).fillColor('#cc0000').font('Helvetica-Bold')
        .text('Canada', pageWidth - margin - 70, footerY + 10);
      doc.rect(pageWidth - margin - 70, footerY + 30, 68, 2).fill('#cc0000');

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = { generateOfferLetter };
