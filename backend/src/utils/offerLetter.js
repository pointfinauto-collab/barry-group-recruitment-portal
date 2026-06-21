const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const COMPANY = {
  name: 'Barry Group Inc.',
  address: '415 Griffin Dr, Corner Brook, NL A2H 3E9, Canada',
  email: 'barrygroup.ltd.inc@gmail.com',
  signatory: 'Emira J. Kadiric',
  signatoryTitle: 'Chief Executive Officer',
  tagline: 'Take Control. Plan to Succeed.',
};

const logoPath = path.join(__dirname, '../../uploads/barry_group_logo.jpg');

const generateOfferLetter = (application, user, profile, lmiaNumber) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const chunks = [];
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const pageWidth = doc.page.width;
      const margin = 50;
      const contentWidth = pageWidth - margin * 2;

      doc.rect(0, 0, pageWidth, 130).fill('#0a2049');

      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, margin, 15, { width: 100, height: 95 });
      }

      doc.fontSize(9).fillColor('#a8d8ea').font('Helvetica')
        .text(COMPANY.address, margin + 110, 25, { align: 'right', width: contentWidth - 110 })
        .text(COMPANY.email, margin + 110, 40, { align: 'right', width: contentWidth - 110 })
        .text(COMPANY.tagline, margin + 110, 55, { align: 'right', width: contentWidth - 110 });

      doc.rect(0, 130, pageWidth, 4).fill('#d97706');

      doc.y = 155;
      doc.fontSize(20).fillColor('#0a2049').font('Helvetica-Bold')
        .text('EMPLOYMENT OFFER LETTER', margin, doc.y, { align: 'center', width: contentWidth });

      doc.moveDown(0.3);
      doc.fontSize(11).fillColor('#d97706').font('Helvetica')
        .text('— OFFICIAL DOCUMENT —', margin, doc.y, { align: 'center', width: contentWidth });

      doc.moveDown(1.5);
      const today = new Date().toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' });
      doc.fontSize(10).fillColor('#333333').font('Helvetica')
        .text(`Date: ${today}`, margin, doc.y)
        .text(`Application No: ${application.application_number}`, margin, doc.y + 15);

      if (lmiaNumber) {
        doc.text(`LMIA Reference: ${lmiaNumber}`, margin, doc.y + 15);
      }

      doc.moveDown(1.5);
      doc.rect(margin, doc.y, contentWidth, 1).fill('#d97706');
      doc.moveDown(0.8);

      const fullName = `${user.first_name} ${user.last_name}`;
      const address = [profile?.address, profile?.city, profile?.country].filter(Boolean).join(', ');

      doc.fontSize(11).fillColor('#0a2049').font('Helvetica-Bold').text(fullName, margin, doc.y);
      doc.fontSize(10).fillColor('#555555').font('Helvetica');
      if (address) doc.text(address, margin, doc.y + 3);
      if (user.email) doc.text(user.email, margin, doc.y + 3);
      if (user.phone) doc.text(user.phone, margin, doc.y + 3);

      doc.moveDown(1.5);
      doc.fontSize(11).fillColor('#333333').font('Helvetica-Bold')
        .text(`Dear ${fullName},`, margin, doc.y);

      doc.moveDown(0.8);
      doc.fontSize(10.5).fillColor('#333333').font('Helvetica')
        .text(
          `On behalf of ${COMPANY.name}, we are pleased to extend this formal offer of employment to you. After careful review of your application and qualifications, we are delighted to welcome you to our team.`,
          margin, doc.y, { width: contentWidth, lineGap: 4 }
        );

      doc.moveDown(1.2);
      const boxY = doc.y;
      const boxHeight = 170;
      doc.rect(margin, boxY, contentWidth, boxHeight).fill('#f0f7ff');
      doc.rect(margin, boxY, 4, boxHeight).fill('#0a2049');

      doc.fontSize(12).fillColor('#0a2049').font('Helvetica-Bold')
        .text('OFFER DETAILS', margin + 15, boxY + 12);

      const details = [
        ['Position', application.desired_position || 'As Discussed'],
        ['Department', application.department || 'To Be Assigned'],
        ['Location', application.preferred_province ? `${application.preferred_province}, Canada` : 'Newfoundland and Labrador, Canada'],
        ['Employment Type', 'Full-Time, Permanent'],
        ['Salary', 'As per company pay scale (CAD)'],
        ['Start Date', 'To Be Confirmed'],
        ['Probation Period', '3 Months'],
      ];

      let detailY = boxY + 32;
      details.forEach(([label, value]) => {
        doc.fontSize(9.5).fillColor('#555555').font('Helvetica-Bold')
          .text(`${label}:`, margin + 15, detailY, { continued: true, width: 130 });
        doc.fontSize(9.5).fillColor('#0a2049').font('Helvetica')
          .text(` ${value}`, { width: contentWidth - 150 });
        detailY += 18;
      });

      if (lmiaNumber) {
        doc.moveDown(1);
        doc.rect(margin, doc.y, contentWidth, 40).fill('#e8f5e9');
        doc.rect(margin, doc.y, 4, 40).fill('#27ae60');
        doc.fontSize(9).fillColor('#1a5c2a').font('Helvetica-Bold')
          .text(`LMIA Reference: ${lmiaNumber}`, margin + 12, doc.y + 6, { width: contentWidth - 20 });
        doc.fontSize(8).fillColor('#2d7a3a').font('Helvetica')
          .text(
            'LMIA reference numbers are given by Canadian federal work skill to Barry Group Inc. They do not constitute official government immigration decisions and visas.',
            margin + 12, doc.y + 3, { width: contentWidth - 20 }
          );
        doc.moveDown(0.5);
      }

      doc.moveDown(1);
      doc.fontSize(11).fillColor('#0a2049').font('Helvetica-Bold')
        .text('EMPLOYMENT BENEFITS', margin, doc.y);
      doc.moveDown(0.4);

      const benefits = [
        'Comprehensive health and dental insurance coverage',
        'Paid vacation and statutory holidays as per Canadian labor law',
        'Housing assistance and relocation support',
        'Professional development and training programs',
        'Overtime pay in accordance with provincial regulations',
        'Safe and inclusive work environment',
      ];

      benefits.forEach(b => {
        doc.fontSize(10).fillColor('#333333').font('Helvetica')
          .text(`  - ${b}`, margin, doc.y, { width: contentWidth, lineGap: 2 });
        doc.moveDown(0.3);
      });

      doc.moveDown(0.8);
      doc.fontSize(11).fillColor('#0a2049').font('Helvetica-Bold')
        .text('CONDITIONS OF EMPLOYMENT', margin, doc.y);
      doc.moveDown(0.4);
      doc.fontSize(10).fillColor('#333333').font('Helvetica')
        .text(
          'This offer is contingent upon: (1) successful completion of background verification, (2) provision of valid identification and work authorization documents, (3) medical clearance if required, and (4) signing of the employment agreement.',
          margin, doc.y, { width: contentWidth, lineGap: 4 }
        );

      doc.moveDown(0.8);
      doc.fontSize(10).fillColor('#333333').font('Helvetica')
        .text(
          'Please confirm your acceptance of this offer by contacting our HR department within 7 business days of receiving this letter.',
          margin, doc.y, { width: contentWidth, lineGap: 4 }
        );

      doc.moveDown(1.5);
      if (doc.y > 680) doc.addPage();

      doc.fontSize(10).fillColor('#333333').font('Helvetica')
        .text('Sincerely,', margin, doc.y);
      doc.moveDown(0.3);
      doc.rect(margin, doc.y + 30, 200, 1).fill('#0a2049');
      doc.moveDown(2.5);

      doc.fontSize(11).fillColor('#0a2049').font('Helvetica-Bold')
        .text(COMPANY.signatory, margin, doc.y);
      doc.fontSize(10).fillColor('#555555').font('Helvetica')
        .text(COMPANY.signatoryTitle, margin, doc.y + 3)
        .text(COMPANY.name, margin, doc.y + 3)
        .text(COMPANY.email, margin, doc.y + 3);

      const footerY = doc.page.height - 60;
      doc.rect(0, footerY - 5, pageWidth, 65).fill('#0a2049');
      doc.fontSize(8).fillColor('#a8d8ea').font('Helvetica')
        .text(
          `${COMPANY.name}  |  ${COMPANY.address}  |  ${COMPANY.email}`,
          margin, footerY + 5, { align: 'center', width: contentWidth }
        );
      doc.fontSize(7.5).fillColor('#6a9bbf')
        .text(
          'LMIA reference numbers are given by Canadian federal work skill to Barry Group Inc. They do not constitute official government immigration decisions and visas.',
          margin, footerY + 20, { align: 'center', width: contentWidth, lineGap: 2 }
        );
      doc.fontSize(8).fillColor('#d97706')
        .text(
          `© ${new Date().getFullYear()} ${COMPANY.name}. All Rights Reserved.`,
          margin, footerY + 42, { align: 'center', width: contentWidth }
        );

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = { generateOfferLetter };
