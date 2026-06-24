const PDFDocument = require('pdfkit');

const LOGO_B64 = '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';
const SEAL_B64 = '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';

const genLMIA   = () => '8' + Math.floor(100000 + Math.random() * 900000);
const genAppNum = () => 'BGI-' + new Date().getFullYear() + '-' + Math.floor(100000 + Math.random() * 900000);
const genEmpID  = () => 'EMP' + Math.floor(10000000 + Math.random() * 90000000);

const generateOfferLetter = (application, user, profile, lmiaNumber) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 0, bufferPages: true });
      const chunks = [];
      doc.on('data', c => chunks.push(c));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const W  = doc.page.width;
      const H  = doc.page.height;
      const ML = 55;
      const CW = W - ML * 2;

      const today    = new Date().toLocaleDateString('en-CA', { year:'numeric', month:'long', day:'numeric' });
      const deadline = new Date(Date.now() + 10*24*60*60*1000).toLocaleDateString('en-CA', { year:'numeric', month:'long', day:'numeric' });
      const lmiaRef  = lmiaNumber || genLMIA();
      const appNum   = genAppNum();
      const empID    = genEmpID();
      const fullName = user.first_name + ' ' + user.last_name;
      const position = application.desired_position || 'To Be Confirmed';
      const province = application.preferred_province || 'Newfoundland and Labrador';

      const logoBuffer = Buffer.from(LOGO_B64, 'base64');
      const sealBuffer = Buffer.from(SEAL_B64, 'base64');

      const NAVY = '#1a3575';
      const WHITE = '#ffffff';
      const GRAY  = '#333333';
      const LGRAY = '#f7f7f7';
      const BORD  = '#cccccc';
      const RED   = '#b52020';
      const GOLD  = '#c8960c';

      // ── HEADER WHITE BG ──
      doc.rect(0, 0, W, 108).fill(WHITE);

      // Logo top-left
      try {
        doc.image(logoBuffer, ML, 14, { width: 215, height: 50 });
      } catch(e) {
        doc.fontSize(16).fillColor(NAVY).font('Helvetica-Bold').text('BARRY GROUP INC.', ML, 28);
      }

      // Company info right
      doc.fontSize(8).fillColor(GRAY).font('Helvetica')
        .text('415 Griffin Dr, Corner Brook, NL A2H 3E9, Canada', ML, 16, { width: CW, align: 'right' })
        .text('Tel: +1 (709) 634-0000', ML, 27, { width: CW, align: 'right' })
        .text('barrygroup.ltd.inc@gmail.com', ML, 38, { width: CW, align: 'right' })
        .text('www.barrygroup.ca', ML, 49, { width: CW, align: 'right' });

      // Divider + title
      doc.rect(ML, 70, CW, 1).fill(NAVY);
      doc.fontSize(13).fillColor(NAVY).font('Helvetica-Bold')
        .text('EMPLOYMENT OFFER LETTER', ML, 78, { width: CW, align: 'right' });
      doc.rect(ML, 98, CW, 0.5).fill(BORD);

      // ── BODY ──
      let y = 113;

      doc.fontSize(9.5).fillColor(GRAY).font('Helvetica').text('Date: ' + today, ML, y);
      y += 20;

      doc.fontSize(10).fillColor(GRAY).font('Helvetica-Bold').text(fullName, ML, y);
      y += 14;
      doc.fontSize(9.5).fillColor(GRAY).font('Helvetica');
      if (profile && profile.address) { doc.text(profile.address, ML, y); y += 13; }
      const cc = [(profile && profile.city)||'', (profile && profile.country)||user.country||''].filter(Boolean).join(', ');
      if (cc) { doc.text(cc, ML, y); y += 13; }
      y += 10;

      doc.fontSize(9.5).fillColor(GRAY).font('Helvetica').text('Dear ' + (user.first_name||'Applicant') + ',', ML, y);
      y += 18;

      // Opening paragraph
      doc.fontSize(9.5).fillColor(GRAY).font('Helvetica')
        .text('We are pleased to offer you the position of ', ML, y, { continued: true });
      doc.font('Helvetica-Bold').text(position, { continued: true });
      doc.font('Helvetica').text(' at Barry Group Inc. at our facility in ' + province + ', Canada.', { width: CW, lineBreak: true });
      y = doc.y + 16;

      // Details table
      const vX   = ML + 172;
      const lineH = 17;
      const rows = [
        ['Position:',        position,         '#333333', false],
        ['Department:',      application.department || 'Operations', '#333333', false],
        ['Location:',        province + ', Canada', '#333333', false],
        ['Employment Type:', 'Full-Time, Permanent', '#333333', false],
        ['Start Date:',      'July 15, ' + new Date().getFullYear() + ' (or as mutually agreed)', '#333333', false],
        ['Working Hours:',   '40 hours per week', '#333333', false],
        ['Wage:',            'CAD 1.50 – 0.00 per hour (based on position)', '#333333', false],
        ['Benefits:',        'Health & Dental Insurance, Paid Vacation, Employee Assistance Program', '#333333', false],
        ['Application Ref:', appNum, '#1a3575', false],
        ['Employer ID:',     empID,  '#1a3575', false],
        ['LMIA Number:',     lmiaRef, '#b52020', true],
      ];

      rows.forEach(([label, value, color, bold], idx) => {
        if (idx % 2 === 0) doc.rect(ML, y, CW, lineH).fill(LGRAY);
        doc.fontSize(9.5).fillColor(GRAY).font('Helvetica-Bold')
          .text(label, ML, y + 3, { width: 168, lineBreak: false });
        doc.fontSize(9.5).fillColor(color).font(bold ? 'Helvetica-Bold' : 'Helvetica')
          .text(value || 'N/A', vX, y + 3, { width: CW - (vX - ML), lineBreak: false });
        y += lineH;
      });

      y += 16;

      // Conditions paragraph
      doc.fontSize(9.5).fillColor(GRAY).font('Helvetica')
        .text('This offer is conditional upon the successful completion of background checks and your ability to obtain the necessary work authorization to work in Canada.', ML, y, { width: CW });
      y = doc.y + 14;

      // LMIA paragraph
      doc.fontSize(9.5).fillColor(GRAY).font('Helvetica')
        .text('We will be applying for a ', ML, y, { continued: true });
      doc.font('Helvetica-Bold').text('Labour Market Impact Assessment (LMIA)', { continued: true });
      doc.font('Helvetica').text(' to support your work permit application. LMIA reference number ', { continued: true });
      doc.fillColor(RED).font('Helvetica-Bold').text(lmiaRef, { continued: true });
      doc.fillColor(GRAY).font('Helvetica').text(' has been assigned to your file.', { width: CW, lineBreak: true });
      y = doc.y + 14;

      // Acceptance
      doc.fontSize(9.5).fillColor(GRAY).font('Helvetica')
        .text('Please sign and return a copy of this letter by ' + deadline + ' to confirm your acceptance.', ML, y, { width: CW });
      y = doc.y + 22;

      // Sincerely
      doc.fontSize(9.5).fillColor(GRAY).font('Helvetica').text('Sincerely,', ML, y);
      y += 42;

      // Signature line
      doc.rect(ML, y, 175, 0.8).fill(GRAY);
      y += 5;
      doc.fontSize(9.5).fillColor(GRAY).font('Helvetica-Bold').text('Emira J. Kadiric', ML, y); y += 14;
      doc.fontSize(9).fillColor(GRAY).font('Helvetica')
        .text('Human Resources Manager', ML, y); y += 12;
      doc.text('Barry Group Inc.', ML, y); y += 12;
      doc.text('barrygroup.ltd.inc@gmail.com', ML, y); y += 12;
      doc.text('Tel: +1 (709) 634-0000', ML, y);

      // ── GOLDEN SEAL (real image) ──
      try {
        doc.image(sealBuffer, ML + CW - 105, y - 95, {
          width: 105,
          height: 105,
        });
      } catch(e) {
        // fallback circle if image fails
        doc.circle(ML + CW - 55, y - 45, 48).lineWidth(2).strokeColor(GOLD).stroke();
        doc.fontSize(7).fillColor(GOLD).font('Helvetica-Bold')
          .text('APPROVED', ML + CW - 80, y - 52, { width: 50, align: 'center', lineBreak: false });
      }

      // ── FOOTER ──
      const fY = H - 32;
      doc.rect(0, fY, W, 32).fill(NAVY);
      doc.rect(0, fY, W, 2).fill(GOLD);
      doc.fontSize(7.5).fillColor(WHITE).font('Helvetica')
        .text('Barry Group Inc.  |  415 Griffin Dr, Corner Brook, NL A2H 3E9, Canada  |  barrygroup.ltd.inc@gmail.com  |  www.barrygroup.ca',
          ML, fY + 9, { width: CW, align: 'center', lineBreak: false });
      doc.fontSize(6.5).fillColor('#a8d8ea')
        .text('This document is issued by Barry Group Inc. for employment purposes only.',
          ML, fY + 20, { width: CW, align: 'center', lineBreak: false });

      doc.end();
    } catch(err) {
      reject(err);
    }
  });
};

module.exports = { generateOfferLetter };
