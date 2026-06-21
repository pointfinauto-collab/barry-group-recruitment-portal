const PDFDocument = require('pdfkit');

// Barry Group Logo embedded as base64
const LOGO_BASE64 = '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';

// ── NUMBER GENERATORS ──

// LMIA: 7 digits starting with 8 (e.g. 8234567)
const generateLMIANumber = () => {
  const digits = Math.floor(100000 + Math.random() * 900000);
  return `8${digits}`;
};

// Employer ID: EMP + 8 random digits
const generateEmployerID = () => {
  const num = Math.floor(10000000 + Math.random() * 90000000);
  return `EMP${num}`;
};

// Third Party ID: TP + 7 random digits
const generateThirdPartyID = () => {
  const num = Math.floor(1000000 + Math.random() * 9000000);
  return `TP${num}`;
};

// Application ref: BGI + year + 6 random digits
const generateAppRef = (appNumber) => {
  if (appNumber && appNumber !== 'N/A') return appNumber;
  const year = new Date().getFullYear();
  const num = Math.floor(100000 + Math.random() * 900000);
  return `BGI-${year}-${num}`;
};

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
      const today = new Date().toLocaleDateString('en-CA', {
        year: 'numeric', month: 'long', day: 'numeric'
      });

      // Generate all unique random numbers
      const employerID = generateEmployerID();
      const lmiaRef = lmiaNumber || generateLMIANumber();
      const thirdPartyID = generateThirdPartyID();
      const appRef = generateAppRef(application.application_number);
      const fullName = `${user.first_name} ${user.last_name}`;
      const logoBuffer = Buffer.from(LOGO_BASE64, 'base64');

      // ── COLORS ──
      const DARK_BLUE = '#1a3a5c';
      const LIGHT_BLUE = '#e8f0f8';
      const GRAY = '#555555';
      const LIGHT_GRAY = '#f5f7fa';
      const BORDER = '#d0dce8';
      const GREEN = '#27ae60';
      const GOLD = '#d97706';

      // ── HEADER ──
      doc.rect(0, 0, pageWidth, 8).fill(DARK_BLUE);
      doc.image(logoBuffer, margin, 18, { width: 85, height: 78 });

      doc.fontSize(17).fillColor(DARK_BLUE).font('Helvetica-Bold')
        .text('Barry Group Inc.', margin + 100, 20, { width: contentWidth - 100, align: 'right' });
      doc.fontSize(8).fillColor(GRAY).font('Helvetica')
        .text('415 Griffin Dr, Corner Brook, NL A2H 3E9, Canada', margin + 100, 42, { width: contentWidth - 100, align: 'right' })
        .text('barrygroup.ltd.inc@gmail.com  |  www.barrygroup.ca', margin + 100, 54, { width: contentWidth - 100, align: 'right' })
        .text('Take Control. Plan to Succeed.', margin + 100, 66, { width: contentWidth - 100, align: 'right' })
        .text(`Date of Issue: ${today}`, margin + 100, 80, { width: contentWidth - 100, align: 'right' });

      doc.rect(margin, 104, contentWidth, 2).fill(DARK_BLUE);
      doc.rect(margin, 106, contentWidth, 1.5).fill(GOLD);

      // ── DOCUMENT TITLE ──
      doc.rect(margin, 116, contentWidth, 30).fill(DARK_BLUE);
      doc.fontSize(13).fillColor('#ffffff').font('Helvetica-Bold')
        .text('EMPLOYMENT OFFER LETTER', margin, 125, { width: contentWidth, align: 'center' });

      // ── REFERENCE BAR ──
      doc.rect(margin, 146, contentWidth, 22).fill(LIGHT_BLUE);
      doc.rect(margin, 146, contentWidth, 22).lineWidth(0.5).stroke(BORDER);

      // Split reference bar into 3 columns
      const refW = contentWidth / 3;
      doc.fontSize(7).fillColor('#888888').font('Helvetica-Bold')
        .text('APPLICATION REFERENCE', margin + 6, 149, { width: refW - 6, lineBreak: false });
      doc.fontSize(7).fillColor('#888888').font('Helvetica-Bold')
        .text('EMPLOYER ID', margin + refW + 6, 149, { width: refW - 6, lineBreak: false });
      doc.fontSize(7).fillColor('#888888').font('Helvetica-Bold')
        .text('LMIA REFERENCE NUMBER', margin + refW * 2 + 6, 149, { width: refW - 6, lineBreak: false });

      doc.fontSize(8.5).fillColor(DARK_BLUE).font('Helvetica-Bold')
        .text(appRef, margin + 6, 158, { width: refW - 6, lineBreak: false });
      doc.fontSize(8.5).fillColor(DARK_BLUE).font('Helvetica-Bold')
        .text(employerID, margin + refW + 6, 158, { width: refW - 6, lineBreak: false });
      doc.fontSize(9).fillColor('#cc0000').font('Helvetica-Bold')
        .text(lmiaRef, margin + refW * 2 + 6, 158, { width: refW - 6, lineBreak: false });

      let y = 178;

      // ── LMIA DESCRIPTION NOTE ──
      doc.rect(margin, y, contentWidth, 38).fill('#fff8e1');
      doc.rect(margin, y, 4, 38).fill(GOLD);
      doc.rect(margin, y, contentWidth, 38).lineWidth(0.5).stroke('#f0c040');

      doc.fontSize(8).fillColor('#7d5a00').font('Helvetica-Bold')
        .text('ABOUT THE LMIA REFERENCE NUMBER:', margin + 10, y + 5, { lineBreak: false });
      doc.fontSize(7.5).fillColor('#5a4000').font('Helvetica')
        .text(
          `This LMIA confirmation number (${lmiaRef}) is a 7-digit unique identifier beginning with 8, generated by Employment and Social Development Canada (ESDC) / Service Canada. It is clearly printed at the top of each page of the official LMIA decision letter and confirms that a positive Labour Market Impact Assessment has been issued for this position.`,
          margin + 10, y + 17, { width: contentWidth - 20, lineBreak: true }
        );
      y += 44;

      // ── HELPER FUNCTIONS ──
      const sectionHeader = (num, title) => {
        doc.rect(margin, y, contentWidth, 20).fill(DARK_BLUE);
        doc.fontSize(9.5).fillColor('#ffffff').font('Helvetica-Bold')
          .text(`${num}.  ${title}`, margin + 8, y + 5, { lineBreak: false });
        y += 24;
      };

      const twoColRow = (l1, v1, l2, v2, h = 36) => {
        const half = contentWidth / 2 - 4;
        doc.rect(margin, y, contentWidth, h).fill(LIGHT_GRAY);
        doc.rect(margin, y, contentWidth, h).lineWidth(0.5).stroke(BORDER);
        doc.rect(margin + half + 4, y, 0.5, h).fill(BORDER);

        doc.fontSize(7.5).fillColor('#888888').font('Helvetica-Bold')
          .text(l1.toUpperCase(), margin + 8, y + 4, { width: half - 8, lineBreak: false });
        doc.fontSize(9).fillColor('#111111').font('Helvetica')
          .text(v1 || 'N/A', margin + 8, y + 15, { width: half - 8, lineBreak: false });

        doc.fontSize(7.5).fillColor('#888888').font('Helvetica-Bold')
          .text(l2.toUpperCase(), margin + half + 12, y + 4, { width: half - 8, lineBreak: false });
        doc.fontSize(9).fillColor('#111111').font('Helvetica')
          .text(v2 || 'N/A', margin + half + 12, y + 15, { width: half - 8, lineBreak: false });
        y += h + 2;
      };

      const oneColRow = (label, value, h = 28) => {
        doc.rect(margin, y, contentWidth, h).fill(LIGHT_GRAY);
        doc.rect(margin, y, contentWidth, h).lineWidth(0.5).stroke(BORDER);
        doc.fontSize(7.5).fillColor('#888888').font('Helvetica-Bold')
          .text(label.toUpperCase(), margin + 8, y + 4, { lineBreak: false });
        doc.fontSize(9).fillColor('#111111').font('Helvetica')
          .text(value || 'N/A', margin + 8, y + 15, { width: contentWidth - 16, lineBreak: false });
        y += h + 2;
      };

      // ── 1. EMPLOYEE INFORMATION ──
      sectionHeader(1, 'EMPLOYEE INFORMATION');
      twoColRow('Full Legal Name', fullName, 'Passport Number', profile?.passport_number || 'N/A');
      twoColRow('Email Address', user.email || 'N/A', 'Phone Number', user.phone || 'N/A');
      twoColRow('Nationality', profile?.nationality || 'N/A', 'Country of Residence', profile?.country || user.country || 'N/A');
      oneColRow('Current Residential Address',
        profile?.address ? `${profile.address}, ${profile.city || ''}, ${profile.country || ''}`.trim() : 'N/A'
      );
      y += 4;

      // ── 2. EMPLOYMENT OFFER DETAILS ──
      sectionHeader(2, 'EMPLOYMENT OFFER DETAILS');
      twoColRow('Job Title / Position', application.desired_position || 'N/A', 'NOC Code', '7736');
      twoColRow('Department', application.department || 'To Be Assigned', 'Employment Type', 'Full-Time, Permanent');
      twoColRow('Work Location', `${application.preferred_province || 'Newfoundland and Labrador'}, Canada`, 'Expected Start Date', 'To Be Confirmed');
      twoColRow('Reporting Supervisor', 'Emira J. Kadiric, CEO', 'Work Schedule', 'Monday – Friday');
      twoColRow('Hours Per Week', '40 Hours', 'Probation Period', '3 Months');
      y += 4;

      // ── 3. COMPENSATION AND BENEFITS ──
      sectionHeader(3, 'COMPENSATION AND BENEFITS');
      twoColRow('Annual Salary', 'CAD $36,000 – $85,000 per Year', 'Overtime Rate', '1.5x Regular Rate (after 40 hrs/week)');
      twoColRow('Vacation Entitlement', '2 Weeks Paid (10 Business Days)', 'Health Benefits', 'Comprehensive Health Coverage');
      twoColRow('Dental Benefits', 'Full Dental Coverage Included', 'Pension / Retirement', 'Company Pension Plan — After 1 Year');
      oneColRow('Additional Benefits', 'Housing Assistance, Relocation Support, Professional Development, Safety Training, Uniform Allowance');
      y += 4;

      // ── 4. JOB DUTIES ──
      sectionHeader(4, 'JOB DUTIES & RESPONSIBILITIES');
      const duties = [
        '• Perform assigned duties in accordance with company standards and Canadian occupational health and safety regulations.',
        '• Maintain high quality and productivity standards on the production floor or assigned department.',
        '• Follow all workplace safety protocols and wear required personal protective equipment at all times.',
        '• Report to the designated supervisor and communicate any workplace concerns promptly.',
        '• Participate in mandatory training programs, safety drills, and performance reviews.',
        '• Comply with all company policies, codes of conduct, and provincial employment standards.',
      ];
      const dutiesH = duties.length * 15 + 12;
      doc.rect(margin, y, contentWidth, dutiesH).fill(LIGHT_GRAY);
      doc.rect(margin, y, contentWidth, dutiesH).lineWidth(0.5).stroke(BORDER);
      y += 7;
      duties.forEach(d => {
        doc.fontSize(8.5).fillColor('#111111').font('Helvetica')
          .text(d, margin + 8, y, { width: contentWidth - 16, lineBreak: false });
        y += 15;
      });
      y += 8;

      // ── 5. LMIA INFORMATION ──
      sectionHeader(5, 'LMIA INFORMATION (LABOUR MARKET IMPACT ASSESSMENT)');
      doc.rect(margin, y, contentWidth, 70).fill('#e8f4e8');
      doc.rect(margin, y, contentWidth, 70).lineWidth(0.5).stroke(GREEN);
      doc.rect(margin, y, 4, 70).fill(GREEN);

      const half = contentWidth / 2 - 4;

      doc.fontSize(7.5).fillColor('#1a5c2a').font('Helvetica-Bold')
        .text('LMIA REFERENCE NUMBER', margin + 10, y + 5, { lineBreak: false });
      doc.fontSize(13).fillColor('#cc0000').font('Helvetica-Bold')
        .text(lmiaRef, margin + 10, y + 16, { lineBreak: false });

      doc.fontSize(7.5).fillColor('#1a5c2a').font('Helvetica-Bold')
        .text('LMIA ISSUE DATE', margin + half + 14, y + 5, { lineBreak: false });
      doc.fontSize(9).fillColor('#111111').font('Helvetica')
        .text(today, margin + half + 14, y + 16, { lineBreak: false });

      doc.fontSize(7.5).fillColor('#1a5c2a').font('Helvetica-Bold')
        .text('THIRD PARTY ID', margin + 10, y + 36, { lineBreak: false });
      doc.fontSize(9).fillColor('#cc0000').font('Helvetica-Bold')
        .text(thirdPartyID, margin + 10, y + 47, { lineBreak: false });

      doc.fontSize(7.5).fillColor('#1a5c2a').font('Helvetica-Bold')
        .text('LMIA EXPIRY DATE', margin + half + 14, y + 36, { lineBreak: false });
      doc.fontSize(9).fillColor('#111111').font('Helvetica')
        .text('2026-12-31', margin + half + 14, y + 47, { lineBreak: false });

      y += 74;

      doc.fontSize(7.5).fillColor('#2d7a3a').font('Helvetica-Oblique')
        .text(
          'This unique LMIA identifier is generated by Employment and Social Development Canada (ESDC) / Service Canada and is clearly printed at the top of each page of the official LMIA decision letter. LMIA reference numbers are given by Canadian federal work skill to Barry Group Inc. and do not constitute official government immigration decisions, visas, or work permits.',
          margin, y, { width: contentWidth }
        );
      y += 28;

      // ── 6. TERMS AND CONDITIONS ──
      sectionHeader(6, 'TERMS AND CONDITIONS');
      const terms = [
        '• PROBATION: Employment is subject to a 3-month probationary period during which performance will be evaluated.',
        '• CONFIDENTIALITY: The employee agrees to maintain confidentiality of all proprietary information and trade secrets.',
        '• WORKPLACE POLICIES: The employee must adhere to all Barry Group Inc. workplace policies and Employee Handbook.',
        '• TERMINATION: Either party may terminate this agreement with 2 weeks written notice or payment in lieu thereof.',
        '• COMPLIANCE: This offer is governed by the Employment Standards Act of the applicable Canadian province.',
        '• BACKGROUND CHECK: This offer is contingent upon successful completion of background verification.',
      ];
      const termsH = terms.length * 15 + 12;
      doc.rect(margin, y, contentWidth, termsH).fill(LIGHT_GRAY);
      doc.rect(margin, y, contentWidth, termsH).lineWidth(0.5).stroke(BORDER);
      y += 7;
      terms.forEach(t => {
        doc.fontSize(8.5).fillColor('#111111').font('Helvetica')
          .text(t, margin + 8, y, { width: contentWidth - 16, lineBreak: false });
        y += 15;
      });
      y += 8;

      // ── 7. ACCEPTANCE & SIGNATURES ──
      sectionHeader(7, 'ACCEPTANCE & SIGNATURES');
      doc.rect(margin, y, contentWidth, 95).fill(LIGHT_GRAY);
      doc.rect(margin, y, contentWidth, 95).lineWidth(0.5).stroke(BORDER);

      // Employer
      doc.fontSize(8.5).fillColor(DARK_BLUE).font('Helvetica-Bold')
        .text('EMPLOYER REPRESENTATIVE', margin + 10, y + 8, { lineBreak: false });
      doc.rect(margin + 10, y + 52, 170, 0.8).fill(GRAY);
      doc.fontSize(9).fillColor('#111111').font('Helvetica-Bold')
        .text('Emira J. Kadiric', margin + 10, y + 57, { lineBreak: false });
      doc.fontSize(8).fillColor(GRAY).font('Helvetica')
        .text('Chief Executive Officer, Barry Group Inc.', margin + 10, y + 70, { lineBreak: false })
        .text(`Date: ${today}`, margin + 10, y + 82, { lineBreak: false });

      // Employee
      doc.fontSize(8.5).fillColor(DARK_BLUE).font('Helvetica-Bold')
        .text('EMPLOYEE ACCEPTANCE', margin + contentWidth / 2 + 10, y + 8, { lineBreak: false });
      doc.rect(margin + contentWidth / 2 + 10, y + 52, 170, 0.8).fill(GRAY);
      doc.fontSize(9).fillColor('#111111').font('Helvetica-Bold')
        .text(fullName, margin + contentWidth / 2 + 10, y + 57, { lineBreak: false });
      doc.fontSize(8).fillColor(GRAY).font('Helvetica')
        .text('Applicant Signature', margin + contentWidth / 2 + 10, y + 70, { lineBreak: false })
        .text('Date: ____________________', margin + contentWidth / 2 + 10, y + 82, { lineBreak: false });

      y += 100;

      // ── FOOTER on all pages ──
      const range = doc.bufferedPageRange();
      for (let i = 0; i < range.count; i++) {
        doc.switchToPage(range.start + i);
        const footerY = doc.page.height - 48;
        doc.rect(0, footerY, pageWidth, 48).fill(DARK_BLUE);
        doc.rect(0, footerY, pageWidth, 2.5).fill(GOLD);

        doc.fontSize(7.5).fillColor('#a8d8ea').font('Helvetica')
          .text(
            'Barry Group Inc.  |  415 Griffin Dr, Corner Brook, NL A2H 3E9, Canada  |  barrygroup.ltd.inc@gmail.com',
            margin, footerY + 8, { width: contentWidth, align: 'center', lineBreak: false }
          );
        doc.fontSize(7).fillColor('#6a9bbf')
          .text(
            'This document is issued by Barry Group Inc. for employment purposes only. All information is provided by authorized users and does not constitute an official government document.',
            margin, footerY + 21, { width: contentWidth, align: 'center', lineBreak: false }
          );
        doc.fontSize(7.5).fillColor('#a8d8ea')
          .text(
            `Page ${i + 1} of ${range.count}`,
            margin, footerY + 36,
            { width: contentWidth, align: 'right', lineBreak: false }
          );
      }

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = { generateOfferLetter };
