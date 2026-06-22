const PDFDocument = require('pdfkit');

// ── BARRY GROUP LOGO (embedded base64 — permanent, never disappears) ──
const LOGO_BASE64 = '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';

// ── NUMBER GENERATORS ──
const generateLMIANumber = () => {
  const digits = Math.floor(100000 + Math.random() * 900000);
  return `8${digits}`;
};

const generateEmployerID = () => {
  return `EMP${Math.floor(10000000 + Math.random() * 90000000)}`;
};

const generateThirdPartyID = () => {
  return `TP${Math.floor(1000000 + Math.random() * 9000000)}`;
};

const generateAppRef = (appNumber) => {
  if (appNumber && appNumber !== 'N/A') return appNumber;
  return `BGI-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
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

      const employerID = generateEmployerID();
      const lmiaRef = lmiaNumber || generateLMIANumber();
      const thirdPartyID = generateThirdPartyID();
      const appRef = generateAppRef(application.application_number);
      const fullName = `${user.first_name} ${user.last_name}`;

      // Convert base64 to buffer for logo
      const logoBuffer = Buffer.from(LOGO_BASE64, 'base64');

      // ── COLORS ──
      const DARK_BLUE = '#1a3a5c';
      const LIGHT_BLUE = '#e8f0f8';
      const GRAY = '#555555';
      const LIGHT_GRAY = '#f5f7fa';
      const BORDER = '#d0dce8';
      const GREEN = '#27ae60';
      const GOLD = '#d97706';
      const RED = '#cc0000';

      // ── TOP BAR ──
      doc.rect(0, 0, pageWidth, 8).fill(DARK_BLUE);

      // ── LOGO (embedded from base64) ──
      try {
        doc.image(logoBuffer, margin, 16, { width: 90, height: 82, fit: [90, 82] });
      } catch (e) {
        // fallback text if logo fails
        doc.fontSize(14).fillColor(RED).font('Helvetica-Bold')
          .text('BARRY GROUP', margin, 35)
          .fontSize(10).text('INC.', margin, 52);
      }

      // ── COMPANY HEADER RIGHT ──
      doc.fontSize(17).fillColor(DARK_BLUE).font('Helvetica-Bold')
        .text('Barry Group Inc.', margin + 105, 18, { width: contentWidth - 105, align: 'right' });
      doc.fontSize(8).fillColor(GRAY).font('Helvetica')
        .text('415 Griffin Dr, Corner Brook, NL A2H 3E9, Canada', margin + 105, 40, { width: contentWidth - 105, align: 'right' })
        .text('barrygroup.ltd.inc@gmail.com  |  www.barrygroup.ca', margin + 105, 52, { width: contentWidth - 105, align: 'right' })
        .text('Take Control. Plan to Succeed.', margin + 105, 64, { width: contentWidth - 105, align: 'right' })
        .text(`Date of Issue: ${today}`, margin + 105, 78, { width: contentWidth - 105, align: 'right' });

      // ── DIVIDER LINES ──
      doc.rect(margin, 105, contentWidth, 2).fill(DARK_BLUE);
      doc.rect(margin, 107, contentWidth, 1.5).fill(GOLD);

      // ── TITLE BLOCK ──
      doc.rect(margin, 117, contentWidth, 30).fill(DARK_BLUE);
      doc.fontSize(13).fillColor('#ffffff').font('Helvetica-Bold')
        .text('EMPLOYMENT OFFER LETTER', margin, 126, { width: contentWidth, align: 'center' });

      // ── REFERENCE BAR ──
      doc.rect(margin, 147, contentWidth, 22).fill(LIGHT_BLUE);
      doc.rect(margin, 147, contentWidth, 22).lineWidth(0.5).stroke(BORDER);

      const refW = contentWidth / 3;
      doc.fontSize(7).fillColor('#888888').font('Helvetica-Bold')
        .text('APPLICATION REFERENCE', margin + 6, 150, { width: refW - 6, lineBreak: false });
      doc.text('EMPLOYER ID', margin + refW + 6, 150, { width: refW - 6, lineBreak: false });
      doc.text('LMIA REFERENCE NUMBER', margin + refW * 2 + 6, 150, { width: refW - 6, lineBreak: false });

      doc.fontSize(8.5).fillColor(DARK_BLUE).font('Helvetica-Bold')
        .text(appRef, margin + 6, 159, { width: refW - 6, lineBreak: false });
      doc.text(employerID, margin + refW + 6, 159, { width: refW - 6, lineBreak: false });
      doc.fontSize(9).fillColor(RED).font('Helvetica-Bold')
        .text(lmiaRef, margin + refW * 2 + 6, 159, { width: refW - 6, lineBreak: false });

      let y = 179;

      // ── LMIA NOTICE BOX ──
      doc.rect(margin, y, contentWidth, 40).fill('#fff8e1');
      doc.rect(margin, y, 4, 40).fill(GOLD);
      doc.rect(margin, y, contentWidth, 40).lineWidth(0.5).stroke('#f0c040');

      doc.fontSize(8).fillColor('#7d5a00').font('Helvetica-Bold')
        .text('ABOUT THE LMIA REFERENCE NUMBER:', margin + 10, y + 5, { lineBreak: false });
      doc.fontSize(7.5).fillColor('#5a4000').font('Helvetica')
        .text(
          `This LMIA confirmation number (${lmiaRef}) is a 7-digit unique identifier beginning with 8, generated by Employment and Social Development Canada (ESDC) / Service Canada. It is clearly printed at the top of each page of the official LMIA decision letter and confirms a positive Labour Market Impact Assessment has been issued for this position.`,
          margin + 10, y + 17, { width: contentWidth - 20 }
        );
      y += 46;

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
        profile?.address
          ? `${profile.address}, ${profile.city || ''}, ${profile.country || ''}`.replace(/,\s*,/g, ',').trim()
          : 'N/A'
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
      const dutiesH = duties.length * 15 + 14;
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
      doc.rect(margin, y, contentWidth, 72).fill('#e8f4e8');
      doc.rect(margin, y, contentWidth, 72).lineWidth(0.5).stroke(GREEN);
      doc.rect(margin, y, 4, 72).fill(GREEN);

      const half = contentWidth / 2 - 4;

      doc.fontSize(7.5).fillColor('#1a5c2a').font('Helvetica-Bold')
        .text('LMIA REFERENCE NUMBER', margin + 10, y + 5, { lineBreak: false });
      doc.fontSize(15).fillColor(RED).font('Helvetica-Bold')
        .text(lmiaRef, margin + 10, y + 16, { lineBreak: false });

      doc.fontSize(7.5).fillColor('#1a5c2a').font('Helvetica-Bold')
        .text('LMIA ISSUE DATE', margin + half + 14, y + 5, { lineBreak: false });
      doc.fontSize(9).fillColor('#111111').font('Helvetica')
        .text(today, margin + half + 14, y + 16, { lineBreak: false });

      doc.fontSize(7.5).fillColor('#1a5c2a').font('Helvetica-Bold')
        .text('THIRD PARTY ID', margin + 10, y + 38, { lineBreak: false });
      doc.fontSize(9).fillColor(RED).font('Helvetica-Bold')
        .text(thirdPartyID, margin + 10, y + 49, { lineBreak: false });

      doc.fontSize(7.5).fillColor('#1a5c2a').font('Helvetica-Bold')
        .text('LMIA EXPIRY DATE', margin + half + 14, y + 38, { lineBreak: false });
      doc.fontSize(9).fillColor('#111111').font('Helvetica')
        .text('2026-12-31', margin + half + 14, y + 49, { lineBreak: false });

      y += 76;
      doc.fontSize(7.5).fillColor('#2d7a3a').font('Helvetica-Oblique')
        .text(
          'This unique LMIA identifier is generated by Employment and Social Development Canada (ESDC) / Service Canada. LMIA reference numbers are given by Canadian federal work skill to Barry Group Inc. and do not constitute official government immigration decisions, visas, or work permits.',
          margin, y, { width: contentWidth }
        );
      y += 26;

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
      const termsH = terms.length * 15 + 14;
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
      doc.rect(margin + contentWidth / 2, y, 0.5, 95).fill(BORDER);

      // Employer side
      doc.fontSize(8.5).fillColor(DARK_BLUE).font('Helvetica-Bold')
        .text('EMPLOYER REPRESENTATIVE', margin + 10, y + 8, { lineBreak: false });
      doc.rect(margin + 10, y + 52, 175, 0.8).fill(GRAY);
      doc.fontSize(9).fillColor('#111111').font('Helvetica-Bold')
        .text('Emira J. Kadiric', margin + 10, y + 57, { lineBreak: false });
      doc.fontSize(8).fillColor(GRAY).font('Helvetica')
        .text('Chief Executive Officer, Barry Group Inc.', margin + 10, y + 70, { lineBreak: false })
        .text(`Date: ${today}`, margin + 10, y + 82, { lineBreak: false });

      // Employee side
      doc.fontSize(8.5).fillColor(DARK_BLUE).font('Helvetica-Bold')
        .text('EMPLOYEE ACCEPTANCE', margin + contentWidth / 2 + 10, y + 8, { lineBreak: false });
      doc.rect(margin + contentWidth / 2 + 10, y + 52, 175, 0.8).fill(GRAY);
      doc.fontSize(9).fillColor('#111111').font('Helvetica-Bold')
        .text(fullName, margin + contentWidth / 2 + 10, y + 57, { lineBreak: false });
      doc.fontSize(8).fillColor(GRAY).font('Helvetica')
        .text('Applicant Signature', margin + contentWidth / 2 + 10, y + 70, { lineBreak: false })
        .text('Date: ____________________', margin + contentWidth / 2 + 10, y + 82, { lineBreak: false });

      // ── FOOTER ON ALL PAGES ──
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
            'This document is issued by Barry Group Inc. for employment purposes only. All information is provided by authorized users.',
            margin, footerY + 22, { width: contentWidth, align: 'center', lineBreak: false }
          );
        doc.fontSize(7.5).fillColor('#a8d8ea')
          .text(`Page ${i + 1} of ${range.count}`, margin, footerY + 36,
            { width: contentWidth, align: 'right', lineBreak: false });
      }

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = { generateOfferLetter };
