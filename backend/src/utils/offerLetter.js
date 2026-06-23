const PDFDocument = require('pdfkit');

// Barry Group clean horizontal logo
const LOGO_B64 = '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';

const genLMIA = () => '8' + Math.floor(100000 + Math.random() * 900000);
const genAppNum = () => 'BGI-' + new Date().getFullYear() + '-' + Math.floor(100000 + Math.random() * 900000);
const genEmpID = () => 'EMP' + Math.floor(10000000 + Math.random() * 90000000);

const generateOfferLetter = (application, user, profile, lmiaNumber) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 0, bufferPages: true });
      const chunks = [];
      doc.on('data', c => chunks.push(c));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const W = doc.page.width;
      const H = doc.page.height;
      const ML = 55;
      const MR = 55;
      const CW = W - ML - MR;

      const today    = new Date().toLocaleDateString('en-CA', { year:'numeric', month:'long', day:'numeric' });
      const deadline = new Date(Date.now() + 10*24*60*60*1000).toLocaleDateString('en-CA', { year:'numeric', month:'long', day:'numeric' });
      const lmiaRef  = lmiaNumber || genLMIA();
      const appNum   = genAppNum();
      const empID    = genEmpID();
      const fullName = user.first_name + ' ' + user.last_name;
      const position = application.desired_position || 'To Be Confirmed';
      const province = application.preferred_province || 'Newfoundland and Labrador';
      const logoBuffer = Buffer.from(LOGO_B64, 'base64');

      // COLORS
      const NAVY  = '#1a3575';
      const WHITE = '#ffffff';
      const GRAY  = '#333333';
      const LGRAY = '#f7f7f7';
      const BORD  = '#cccccc';
      const GREEN = '#1a6b35';
      const RED   = '#b52020';
      const GOLD  = '#c8960c';

      // ── TOP HEADER ──
      doc.rect(0, 0, W, 110).fill(WHITE);

      // Logo top-left on white background
      try {
        doc.image(logoBuffer, ML, 16, { width: 210, height: 48 });
      } catch(e) {
        doc.fontSize(16).fillColor(NAVY).font('Helvetica-Bold').text('BARRY GROUP INC.', ML, 30);
      }

      // Company info top-right
      doc.fontSize(8).fillColor(GRAY).font('Helvetica')
        .text('415 Griffin Dr, Corner Brook, NL A2H 3E9, Canada', ML, 18, { width: CW, align: 'right' })
        .text('Tel: +1 (709) 634-0000', ML, 29, { width: CW, align: 'right' })
        .text('barrygroup.ltd.inc@gmail.com', ML, 40, { width: CW, align: 'right' })
        .text('www.barrygroup.ca', ML, 51, { width: CW, align: 'right' });

      // Divider line
      doc.rect(ML, 72, CW, 1).fill(NAVY);

      // Document title right-aligned
      doc.fontSize(13).fillColor(NAVY).font('Helvetica-Bold')
        .text('EMPLOYMENT OFFER LETTER', ML, 80, { width: CW, align: 'right' });

      // Second thin divider
      doc.rect(ML, 100, CW, 0.5).fill(BORD);

      // ── DATE & RECIPIENT ──
      let y = 116;

      doc.fontSize(9.5).fillColor(GRAY).font('Helvetica')
        .text('Date: ' + today, ML, y);
      y += 20;

      // Recipient block
      doc.fontSize(10).fillColor(GRAY).font('Helvetica-Bold').text(fullName, ML, y);
      y += 14;
      doc.fontSize(9.5).fillColor(GRAY).font('Helvetica');
      if (profile && profile.address) { doc.text(profile.address, ML, y); y += 13; }
      const cityCountry = [(profile && profile.city)||'', (profile && profile.country)||user.country||''].filter(Boolean).join(', ');
      if (cityCountry) { doc.text(cityCountry, ML, y); y += 13; }
      y += 10;

      // ── SALUTATION ──
      doc.fontSize(9.5).fillColor(GRAY).font('Helvetica')
        .text('Dear ' + (user.first_name || 'Applicant') + ',', ML, y);
      y += 18;

      // ── OPENING PARAGRAPH ──
      doc.fontSize(9.5).fillColor(GRAY).font('Helvetica')
        .text('We are pleased to offer you the position of ', ML, y, { continued: true });
      doc.font('Helvetica-Bold').text(position, { continued: true });
      doc.font('Helvetica').text(
        ' at Barry Group Inc. at our facility in ' + province + ', Canada.',
        { lineBreak: true, width: CW }
      );
      y = doc.y + 16;

      // ── JOB DETAILS TABLE ──
      const labelX = ML;
      const valueX = ML + 170;
      const lineH  = 17;

      const rows = [
        ['Position:',        position],
        ['Department:',      application.department || 'Operations'],
        ['Location:',        province + ', Canada'],
        ['Employment Type:', 'Full-Time, Permanent'],
        ['Start Date:',      'July 15, ' + new Date().getFullYear() + ' (or as mutually agreed)'],
        ['Working Hours:',   '40 hours per week'],
        ['Wage:',            'CAD $21.50 – $40.00 per hour (based on position)'],
        ['Benefits:',        'Health & Dental Insurance, Paid Vacation, Employee Assistance Program'],
        ['Application Ref:', appNum],
        ['Employer ID:',     empID],
        ['LMIA Number:',     lmiaRef],
      ];

      rows.forEach(([label, value], idx) => {
        if (idx % 2 === 0) doc.rect(ML, y, CW, lineH).fill(LGRAY);
        // label
        doc.fontSize(9.5).fillColor(GRAY).font('Helvetica-Bold')
          .text(label, labelX, y + 3, { width: 165, lineBreak: false });
        // value — colour special fields
        let vc = GRAY;
        if (label === 'LMIA Number:') vc = RED;
        if (label === 'Application Ref:' || label === 'Employer ID:') vc = NAVY;
        doc.fontSize(9.5).fillColor(vc).font(label === 'LMIA Number:' ? 'Helvetica-Bold' : 'Helvetica')
          .text(value || 'N/A', valueX, y + 3, { width: CW - (valueX - ML), lineBreak: false });
        y += lineH;
      });

      y += 16;

      // ── CONDITIONS PARAGRAPH ──
      doc.fontSize(9.5).fillColor(GRAY).font('Helvetica')
        .text(
          'This offer is conditional upon the successful completion of background checks and your ability to obtain the necessary work authorization to work in Canada.',
          ML, y, { width: CW }
        );
      y = doc.y + 14;

      // ── LMIA PARAGRAPH ──
      doc.fontSize(9.5).fillColor(GRAY).font('Helvetica')
        .text('We will be applying for a ', ML, y, { continued: true });
      doc.font('Helvetica-Bold').text('Labour Market Impact Assessment (LMIA)', { continued: true });
      doc.font('Helvetica').text(' to support your work permit application. LMIA reference number ', { continued: true });
      doc.fillColor(RED).font('Helvetica-Bold').text(lmiaRef, { continued: true });
      doc.fillColor(GRAY).font('Helvetica').text(' has been assigned to your file.', { width: CW, lineBreak: true });
      y = doc.y + 14;

      // ── ACCEPTANCE LINE ──
      doc.fontSize(9.5).fillColor(GRAY).font('Helvetica')
        .text(
          'Please sign and return a copy of this letter by ' + deadline + ' to confirm your acceptance.',
          ML, y, { width: CW }
        );
      y = doc.y + 22;

      // ── SINCERELY + SIGNATURE BLOCK ──
      doc.fontSize(9.5).fillColor(GRAY).font('Helvetica').text('Sincerely,', ML, y);
      y += 42; // space for signature

      // Signature line
      doc.rect(ML, y, 170, 0.8).fill(GRAY);
      y += 5;
      doc.fontSize(9.5).fillColor(GRAY).font('Helvetica-Bold').text('Emira J. Kadiric', ML, y); y += 14;
      doc.fontSize(9).fillColor(GRAY).font('Helvetica')
        .text('Human Resources Manager', ML, y); y += 12;
      doc.text('Barry Group Inc.', ML, y); y += 12;
      doc.text('barrygroup.ltd.inc@gmail.com', ML, y); y += 12;
      doc.text('Tel: +1 (709) 634-0000', ML, y);

      // ── APPROVAL SEAL (circular stamp, right side of signature) ──
      const sX = ML + CW - 85;
      const sY = y - 58;
      const sR = 50;

      // Outer ring
      doc.circle(sX, sY, sR).lineWidth(2.8).strokeColor(GREEN).stroke();
      // Inner ring
      doc.circle(sX, sY, sR - 7).lineWidth(1).strokeColor(GREEN).stroke();

      // Top arc text "BARRY GROUP INC."
      doc.fontSize(6.5).fillColor(GREEN).font('Helvetica-Bold')
        .text('BARRY GROUP INC.', sX - 34, sY - 22, { width: 68, align: 'center', lineBreak: false });

      // Star / symbol
      doc.fontSize(20).fillColor(GREEN).font('Helvetica-Bold')
        .text('✦', sX - 10, sY - 13, { lineBreak: false });

      // APPROVED
      doc.fontSize(8).fillColor(GREEN).font('Helvetica-Bold')
        .text('APPROVED', sX - 24, sY + 5, { width: 48, align: 'center', lineBreak: false });

      // Bottom text
      doc.fontSize(5.5).fillColor(GREEN).font('Helvetica')
        .text('CORNER BROOK · CANADA', sX - 36, sY + 17, { width: 72, align: 'center', lineBreak: false });
      doc.fontSize(6).fillColor(GREEN).font('Helvetica')
        .text(new Date().getFullYear().toString(), sX - 12, sY + 28, { width: 24, align: 'center', lineBreak: false });

      // ── NAVY FOOTER ──
      const fY = H - 32;
      doc.rect(0, fY, W, 32).fill(NAVY);
      doc.rect(0, fY, W, 2).fill(GOLD);
      doc.fontSize(7.5).fillColor(WHITE).font('Helvetica')
        .text(
          'Barry Group Inc.  |  415 Griffin Dr, Corner Brook, NL A2H 3E9, Canada  |  barrygroup.ltd.inc@gmail.com  |  www.barrygroup.ca',
          ML, fY + 9, { width: CW, align: 'center', lineBreak: false }
        );
      doc.fontSize(6.5).fillColor('#a8d8ea')
        .text(
          'This document is issued by Barry Group Inc. for employment purposes only.',
          ML, fY + 20, { width: CW, align: 'center', lineBreak: false }
        );

      doc.end();
    } catch(err) {
      reject(err);
    }
  });
};

module.exports = { generateOfferLetter };
