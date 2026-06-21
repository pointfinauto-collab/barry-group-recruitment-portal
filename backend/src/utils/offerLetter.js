const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const logoPath = path.join(__dirname, '../../uploads/barry_group_logo.jpg');

const generateEmployerID = () => {
  const num = Math.floor(10000000 + Math.random() * 90000000);
  return `EMP${num}`;
};

const generateLMIARef = (appNumber) => {
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
      const lmiaRef = lmiaNumber || generateLMIARef(application.application_number);
      const appNumber = application.application_number || 'N/A';
      const col1x = margin;
      const col2x = margin + contentWidth / 2;
      const colW = contentWidth / 2 - 8;

      // ─── TOP BARCODE BAR ───
      doc.rect(0, 0, pageWidth, 22).fill('#000000');
      doc.fontSize(6).fillColor('#ffffff').font('Helvetica')
        .text(
          `||| ||| ||| ||| ||| ||| ||| |||    ${appNumber}    ||| ||| ||| ||| ||| ||| ||| |||`,
          margin, 8, { width: contentWidth, align: 'center' }
        );

      // ─── HEADER ───
      let y = 30;

      // Logo box
      doc.rect(margin, y, 95, 60).lineWidth(1.5).stroke('#cc0000');
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, margin + 3, y + 3, { width: 89, height: 54 });
      } else {
        doc.fontSize(11).fillColor('#cc0000').font('Helvetica-Bold')
          .text('BARRY GROUP INC.', margin + 5, y + 22);
      }

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
        .text(user.last_name?.toUpperCase() || 'N/A', margin + 8, y + 4,
          { width: 130, lineBreak: false });
      doc.text(user.first_name?.toUpperCase() || 'N/A', margin + 158, y + 4,
        { width: 130, lineBreak: false });
      doc.font('Helvetica')
        .text(profile?.passport_number || 'N/A', margin + 308, y + 4,
          { width: 140, lineBreak: false });
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
        .text('LMIA REFERENCE NUMBER:', margin + 12, y + 5, { lineBreak: false });
      doc.fontSize(12).fillColor('#cc0000').font('Helvetica-Bold')
        .text(`  ${lmiaRef}`);
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
      y += 16;

      // ─── FOOTER (fixed at bottom) ───
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
