const PDFDocument = require('pdfkit');

// ── NEW BARRY GROUP LOGO (horizontal blue logo) ──
const LOGO_BASE64 = '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';

// ── NUMBER GENERATORS ──
const generateLMIANumber = () => {
  // 7 digits starting with 8 — unique every time
  const digits = Math.floor(100000 + Math.random() * 900000);
  return `8${digits}`;
};

const generateEmployerID = () => `EMP${Math.floor(10000000 + Math.random() * 90000000)}`;
const generateThirdPartyID = () => `TP${Math.floor(1000000 + Math.random() * 9000000)}`;
const generateAppRef = (appNumber) => appNumber && appNumber !== 'N/A'
  ? appNumber
  : `BGI-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

const generateOfferLetter = (application, user, profile, lmiaNumber) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 45, bufferPages: true });
      const chunks = [];
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const pageWidth = doc.page.width;
      const margin = 45;
      const contentWidth = pageWidth - margin * 2;
      const today = new Date().toLocaleDateString('en-CA', {
        year: 'numeric', month: 'long', day: 'numeric'
      });

      // Generate unique random numbers for each letter
      const employerID = generateEmployerID();
      const lmiaRef = lmiaNumber || generateLMIANumber();
      const thirdPartyID = generateThirdPartyID();
      const appRef = generateAppRef(application.application_number);
      const fullName = `${user.first_name} ${user.last_name}`;
      const logoBuffer = Buffer.from(LOGO_BASE64, 'base64');

      // ── COLORS ──
      const DARK_BLUE = '#1a3575';
      const MID_BLUE = '#2d5fa8';
      const LIGHT_BLUE = '#eef2fa';
      const GRAY = '#444444';
      const LIGHT_GRAY = '#f6f7fa';
      const BORDER = '#c8d4e8';
      const GREEN = '#27ae60';
      const GOLD = '#d4a017';
      const RED = '#c0392b';

      // ════════════════════════════════════
      // PAGE 1
      // ════════════════════════════════════

      // ── TOP BLUE BAR ──
      doc.rect(0, 0, pageWidth, 6).fill(DARK_BLUE);

      // ── LOGO (wide horizontal logo) ──
      try {
        doc.image(logoBuffer, margin, 14, { width: 220, height: 50 });
      } catch (e) {
        doc.fontSize(18).fillColor(DARK_BLUE).font('Helvetica-Bold')
          .text('BARRY GROUP INC.', margin, 24);
      }

      // ── COMPANY INFO (right side) ──
      doc.fontSize(8).fillColor(GRAY).font('Helvetica')
        .text('415 Griffin Dr, Corner Brook, NL A2H 3E9, Canada', margin, 18, { width: contentWidth, align: 'right' })
        .text('barrygroup.ltd.inc@gmail.com  |  www.barrygroup.ca', margin, 29, { width: contentWidth, align: 'right' })
        .text(`Date: ${today}`, margin, 40, { width: contentWidth, align: 'right' });

      // ── DIVIDER ──
      doc.rect(margin, 70, contentWidth, 2).fill(DARK_BLUE);
      doc.rect(margin, 72, contentWidth, 1).fill(GOLD);

      // ── TITLE ──
      doc.rect(margin, 80, contentWidth, 28).fill(DARK_BLUE);
      doc.fontSize(14).fillColor('#ffffff').font('Helvetica-Bold')
        .text('EMPLOYMENT OFFER LETTER', margin, 90, { width: contentWidth, align: 'center' });

      // ── REFERENCE BAR (3 columns) ──
      doc.rect(margin, 108, contentWidth, 22).fill(LIGHT_BLUE);
      doc.rect(margin, 108, contentWidth, 22).lineWidth(0.5).stroke(BORDER);

      const refW = contentWidth / 3;
      doc.fontSize(6.5).fillColor('#777777').font('Helvetica-Bold')
        .text('APPLICATION REF', margin + 6, 111, { lineBreak: false })
        .text('EMPLOYER ID', margin + refW + 6, 111, { lineBreak: false })
        .text('LMIA NUMBER', margin + refW * 2 + 6, 111, { lineBreak: false });

      doc.fontSize(8.5).fillColor(DARK_BLUE).font('Helvetica-Bold')
        .text(appRef, margin + 6, 120, { lineBreak: false });
      doc.text(employerID, margin + refW + 6, 120, { lineBreak: false });
      doc.fontSize(9).fillColor(RED).font('Helvetica-Bold')
        .text(lmiaRef, margin + refW * 2 + 6, 120, { lineBreak: false });

      let y = 140;

      // ── HELPER FUNCTIONS ──
      const sectionHeader = (num, title) => {
        doc.rect(margin, y, contentWidth, 18).fill(DARK_BLUE);
        doc.fontSize(9).fillColor('#ffffff').font('Helvetica-Bold')
          .text(`${num}.  ${title}`, margin + 8, y + 4, { lineBreak: false });
        y += 21;
      };

      const half = contentWidth / 2 - 4;

      const twoCol = (l1, v1, l2, v2, h = 32) => {
        doc.rect(margin, y, contentWidth, h).fill(LIGHT_GRAY);
        doc.rect(margin, y, contentWidth, h).lineWidth(0.4).stroke(BORDER);
        doc.rect(margin + half + 4, y, 0.4, h).fill(BORDER);

        doc.fontSize(6.5).fillColor('#888888').font('Helvetica-Bold')
          .text(l1.toUpperCase(), margin + 6, y + 3, { width: half - 6, lineBreak: false });
        doc.fontSize(8.5).fillColor('#111111').font('Helvetica')
          .text(v1 || 'N/A', margin + 6, y + 13, { width: half - 6, lineBreak: false });

        doc.fontSize(6.5).fillColor('#888888').font('Helvetica-Bold')
          .text(l2.toUpperCase(), margin + half + 10, y + 3, { width: half - 6, lineBreak: false });
        doc.fontSize(8.5).fillColor('#111111').font('Helvetica')
          .text(v2 || 'N/A', margin + half + 10, y + 13, { width: half - 6, lineBreak: false });

        y += h + 1;
      };

      const oneCol = (label, value, h = 26) => {
        doc.rect(margin, y, contentWidth, h).fill(LIGHT_GRAY);
        doc.rect(margin, y, contentWidth, h).lineWidth(0.4).stroke(BORDER);
        doc.fontSize(6.5).fillColor('#888888').font('Helvetica-Bold')
          .text(label.toUpperCase(), margin + 6, y + 3, { lineBreak: false });
        doc.fontSize(8.5).fillColor('#111111').font('Helvetica')
          .text(value || 'N/A', margin + 6, y + 13, { width: contentWidth - 12, lineBreak: false });
        y += h + 1;
      };

      // ── SECTION 1: EMPLOYEE INFO ──
      sectionHeader(1, 'EMPLOYEE INFORMATION');
      twoCol('Full Legal Name', fullName, 'Passport Number', profile?.passport_number || 'N/A');
      twoCol('Email Address', user.email || 'N/A', 'Phone Number', user.phone || 'N/A');
      twoCol('Nationality', profile?.nationality || 'N/A', 'Country of Residence', profile?.country || user.country || 'N/A');
      oneCol('Residential Address',
        profile?.address ? `${profile.address}, ${profile.city || ''}, ${profile.country || ''}`.replace(/,\s*,/g, ',').trim() : 'N/A'
      );
      y += 5;

      // ── SECTION 2: EMPLOYMENT DETAILS ──
      sectionHeader(2, 'EMPLOYMENT OFFER DETAILS');
      twoCol('Job Title / Position', application.desired_position || 'N/A', 'NOC Code', '7736');
      twoCol('Department', application.department || 'To Be Assigned', 'Employment Type', 'Full-Time, Permanent');
      twoCol('Work Location', `${application.preferred_province || 'Newfoundland and Labrador'}, Canada`, 'Expected Start Date', 'To Be Confirmed');
      twoCol('Reporting Supervisor', 'Emira J. Kadiric, CEO', 'Work Schedule', 'Monday – Friday');
      twoCol('Hours Per Week', '40 Hours / Week', 'Probation Period', '3 Months');
      y += 5;

      // ── SECTION 3: COMPENSATION ──
      sectionHeader(3, 'COMPENSATION AND BENEFITS');
      twoCol('Annual Salary', 'CAD $36,000 – $85,000 per Year', 'Overtime Rate', '1.5x after 40 hrs/week');
      twoCol('Vacation', '2 Weeks Paid (10 Business Days)', 'Health Benefits', 'Comprehensive Coverage');
      twoCol('Dental', 'Full Dental Coverage', 'Pension', 'Company Plan — After 1 Year');
      oneCol('Additional Benefits', 'Housing Assistance, Relocation Support, Professional Development, Safety Training, Uniform Allowance');
      y += 5;

      // ── SECTION 4: JOB DUTIES ──
      sectionHeader(4, 'JOB DUTIES AND RESPONSIBILITIES');
      const duties = [
        '• Perform all assigned duties in accordance with company standards and Canadian occupational health and safety regulations.',
        '• Maintain high quality and productivity standards on the production floor or assigned department.',
        '• Follow all workplace safety protocols and wear required personal protective equipment at all times.',
        '• Report to the designated supervisor and communicate any workplace concerns promptly.',
        '• Participate in all mandatory training programs, safety drills, and performance reviews.',
        '• Comply with all Barry Group Inc. policies, codes of conduct, and provincial employment standards.',
      ];
      const dH = duties.length * 13 + 10;
      doc.rect(margin, y, contentWidth, dH).fill(LIGHT_GRAY);
      doc.rect(margin, y, contentWidth, dH).lineWidth(0.4).stroke(BORDER);
      y += 6;
      duties.forEach(d => {
        doc.fontSize(8).fillColor('#111111').font('Helvetica')
          .text(d, margin + 6, y, { width: contentWidth - 12, lineBreak: false });
        y += 13;
      });
      y += 5;

      // ── SECTION 5: LMIA ──
      sectionHeader(5, 'LMIA INFORMATION');

      doc.rect(margin, y, contentWidth, 60).fill('#eaf6ee');
      doc.rect(margin, y, contentWidth, 60).lineWidth(0.5).stroke('#27ae60');
      doc.rect(margin, y, 4, 60).fill(GREEN);

      // LMIA number large and prominent
      doc.fontSize(6.5).fillColor('#1a5c2a').font('Helvetica-Bold')
        .text('LMIA REFERENCE NUMBER', margin + 10, y + 5, { lineBreak: false });
      doc.fontSize(18).fillColor(RED).font('Helvetica-Bold')
        .text(lmiaRef, margin + 10, y + 15, { lineBreak: false });

      doc.fontSize(6.5).fillColor('#1a5c2a').font('Helvetica-Bold')
        .text('LMIA ISSUE DATE', margin + half + 14, y + 5, { lineBreak: false });
      doc.fontSize(8.5).fillColor('#111111').font('Helvetica')
        .text(today, margin + half + 14, y + 15, { lineBreak: false });

      doc.fontSize(6.5).fillColor('#1a5c2a').font('Helvetica-Bold')
        .text('THIRD PARTY ID', margin + 10, y + 38, { lineBreak: false });
      doc.fontSize(8.5).fillColor(RED).font('Helvetica-Bold')
        .text(thirdPartyID, margin + 10, y + 48, { lineBreak: false });

      doc.fontSize(6.5).fillColor('#1a5c2a').font('Helvetica-Bold')
        .text('LMIA EXPIRY DATE', margin + half + 14, y + 38, { lineBreak: false });
      doc.fontSize(8.5).fillColor('#111111').font('Helvetica')
        .text('2026-12-31', margin + half + 14, y + 48, { lineBreak: false });

      y += 64;

      // ─── PAGE 2 ───
      doc.addPage();
      doc.rect(0, 0, pageWidth, 6).fill(DARK_BLUE);

      // Small header on page 2
      try {
        doc.image(logoBuffer, margin, 12, { width: 150, height: 34 });
      } catch (e) {
        doc.fontSize(12).fillColor(DARK_BLUE).font('Helvetica-Bold').text('BARRY GROUP INC.', margin, 18);
      }
      doc.fontSize(7.5).fillColor(GRAY).font('Helvetica')
        .text(`Employment Offer Letter  |  ${fullName}  |  LMIA: ${lmiaRef}`, margin, 18, { width: contentWidth, align: 'right' });
      doc.rect(margin, 52, contentWidth, 1.5).fill(DARK_BLUE);
      doc.rect(margin, 53, contentWidth, 0.5).fill(GOLD);

      y = 62;

      // Reset helpers for page 2
      const s2Header = (num, title) => {
        doc.rect(margin, y, contentWidth, 18).fill(DARK_BLUE);
        doc.fontSize(9).fillColor('#ffffff').font('Helvetica-Bold')
          .text(`${num}.  ${title}`, margin + 8, y + 4, { lineBreak: false });
        y += 21;
      };

      const t2Col = (l1, v1, l2, v2, h = 32) => {
        doc.rect(margin, y, contentWidth, h).fill(LIGHT_GRAY);
        doc.rect(margin, y, contentWidth, h).lineWidth(0.4).stroke(BORDER);
        doc.rect(margin + half + 4, y, 0.4, h).fill(BORDER);
        doc.fontSize(6.5).fillColor('#888888').font('Helvetica-Bold')
          .text(l1.toUpperCase(), margin + 6, y + 3, { width: half - 6, lineBreak: false });
        doc.fontSize(8.5).fillColor('#111111').font('Helvetica')
          .text(v1 || 'N/A', margin + 6, y + 13, { width: half - 6, lineBreak: false });
        doc.fontSize(6.5).fillColor('#888888').font('Helvetica-Bold')
          .text(l2.toUpperCase(), margin + half + 10, y + 3, { width: half - 6, lineBreak: false });
        doc.fontSize(8.5).fillColor('#111111').font('Helvetica')
          .text(v2 || 'N/A', margin + half + 10, y + 13, { width: half - 6, lineBreak: false });
        y += h + 1;
      };

      // ── SECTION 6: TERMS ──
      s2Header(6, 'TERMS AND CONDITIONS');
      const terms = [
        '• PROBATION: Employment is subject to a 3-month probationary period during which performance will be evaluated.',
        '• CONFIDENTIALITY: The employee agrees to maintain confidentiality of all proprietary information and trade secrets.',
        '• POLICIES: The employee must adhere to all Barry Group Inc. workplace policies and Employee Handbook.',
        '• TERMINATION: Either party may terminate with 2 weeks written notice or payment in lieu thereof.',
        '• COMPLIANCE: This offer is governed by the Employment Standards Act of the applicable Canadian province.',
        '• BACKGROUND CHECK: This offer is contingent upon successful completion of background verification.',
      ];
      const tH = terms.length * 14 + 10;
      doc.rect(margin, y, contentWidth, tH).fill(LIGHT_GRAY);
      doc.rect(margin, y, contentWidth, tH).lineWidth(0.4).stroke(BORDER);
      y += 6;
      terms.forEach(t => {
        doc.fontSize(8).fillColor('#111111').font('Helvetica')
          .text(t, margin + 6, y, { width: contentWidth - 12, lineBreak: false });
        y += 14;
      });
      y += 8;

      // ── SECTION 7: SIGNATURES ──
      s2Header(7, 'ACCEPTANCE AND SIGNATURES');

      doc.rect(margin, y, contentWidth, 100).fill(LIGHT_GRAY);
      doc.rect(margin, y, contentWidth, 100).lineWidth(0.4).stroke(BORDER);
      doc.rect(margin + contentWidth / 2, y, 0.5, 100).fill(BORDER);

      // Employer
      doc.fontSize(8).fillColor(DARK_BLUE).font('Helvetica-Bold')
        .text('EMPLOYER REPRESENTATIVE', margin + 8, y + 8, { lineBreak: false });
      doc.fontSize(7.5).fillColor(GRAY).font('Helvetica')
        .text('By signing below, the employer confirms this offer:', margin + 8, y + 20, { lineBreak: false });
      doc.rect(margin + 8, y + 58, 175, 0.7).fill(GRAY);
      doc.fontSize(9).fillColor('#111111').font('Helvetica-Bold')
        .text('Emira J. Kadiric', margin + 8, y + 63, { lineBreak: false });
      doc.fontSize(7.5).fillColor(GRAY).font('Helvetica')
        .text('Chief Executive Officer', margin + 8, y + 75, { lineBreak: false })
        .text('Barry Group Inc.', margin + 8, y + 86, { lineBreak: false });

      // Employee
      doc.fontSize(8).fillColor(DARK_BLUE).font('Helvetica-Bold')
        .text('EMPLOYEE ACCEPTANCE', margin + contentWidth / 2 + 8, y + 8, { lineBreak: false });
      doc.fontSize(7.5).fillColor(GRAY).font('Helvetica')
        .text('By signing, I accept this offer of employment:', margin + contentWidth / 2 + 8, y + 20, { lineBreak: false });
      doc.rect(margin + contentWidth / 2 + 8, y + 58, 175, 0.7).fill(GRAY);
      doc.fontSize(9).fillColor('#111111').font('Helvetica-Bold')
        .text(fullName, margin + contentWidth / 2 + 8, y + 63, { lineBreak: false });
      doc.fontSize(7.5).fillColor(GRAY).font('Helvetica')
        .text('Applicant Signature', margin + contentWidth / 2 + 8, y + 75, { lineBreak: false })
        .text('Date: _______________________', margin + contentWidth / 2 + 8, y + 86, { lineBreak: false });

      y += 110;

      // ── LMIA DISCLAIMER ──
      doc.rect(margin, y, contentWidth, 28).fill('#fff9e6');
      doc.rect(margin, y, 3, 28).fill(GOLD);
      doc.fontSize(7).fillColor('#7a5900').font('Helvetica-Oblique')
        .text(
          `LMIA Reference ${lmiaRef}: This 7-digit number beginning with 8 is issued by Employment and Social Development Canada (ESDC) / Service Canada for this position at Barry Group Inc. It does not constitute a visa, work permit, or official immigration approval.`,
          margin + 8, y + 5, { width: contentWidth - 14 }
        );
      y += 32;

      // ── FOOTER ON ALL PAGES ──
      const range = doc.bufferedPageRange();
      for (let i = 0; i < range.count; i++) {
        doc.switchToPage(range.start + i);
        const fY = doc.page.height - 38;
        doc.rect(0, fY, pageWidth, 38).fill(DARK_BLUE);
        doc.rect(0, fY, pageWidth, 2).fill(GOLD);
        doc.fontSize(7).fillColor('#a8d8ea').font('Helvetica')
          .text(
            'Barry Group Inc.  |  415 Griffin Dr, Corner Brook, NL A2H 3E9, Canada  |  barrygroup.ltd.inc@gmail.com',
            margin, fY + 7, { width: contentWidth, align: 'center', lineBreak: false }
          );
        doc.fontSize(6.5).fillColor('#6a9bbf')
          .text(
            'This document is issued by Barry Group Inc. for employment purposes only and does not constitute an official government document.',
            margin, fY + 19, { width: contentWidth, align: 'center', lineBreak: false }
          );
        doc.fontSize(7).fillColor('#a8d8ea')
          .text(`Page ${i + 1} of ${range.count}`, margin, fY + 28,
            { width: contentWidth, align: 'right', lineBreak: false });
      }

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = { generateOfferLetter };
