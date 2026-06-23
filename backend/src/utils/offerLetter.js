const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Target the new logo file name exactly
const logoPath = path.join(__dirname, '../../uploads/barry-group-logo_2.png');

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
      
      const today = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      const fullName = `${user.first_name || 'Applicant'} ${user.last_name || ''}`.trim();

      // ─── HEADER AREA ───
      // Left: Wide Logo (barry-group-logo_2.png)
      if (fs.existsSync(logoPath)) {
        try {
          doc.image(logoPath, margin, 42, { width: 220 });
        } catch (imageErr) {
          console.error("PDFKit failed to parse the logo file:", imageErr.message);
          doc.fontSize(14).fillColor('#0d3b66').font('Helvetica-Bold').text('Barry Group Inc.', margin, 45);
        }
      } else {
        doc.fontSize(14).fillColor('#0d3b66').font('Helvetica-Bold').text('Barry Group Inc.', margin, 45);
      }

      // Right: Company Details (Aligned top right to match the sample format)
      doc.fontSize(8).fillColor('#444444').font('Helvetica')
        .text('415 Griffin Dr, Corner Brook', pageWidth - margin - 180, 42, { align: 'right', width: 180 })
        .text('Newfoundland and Labrador, A2H 3E9', { align: 'right', width: 180 })
        .text('Tel: +1 (709) 637-1400', { align: 'right', width: 180 })
        .text('www.barrygroup.ca', { align: 'right', width: 180 });

      // Horizontal divider line matching the signature brand blue color
      doc.moveDown(2);
      doc.y = 100;
      doc.rect(margin, doc.y, contentWidth, 1.5).fill('#0d3b66');
      
      // Document Title
      doc.moveDown(1.5);
      doc.fontSize(11).fillColor('#000000').font('Helvetica-Bold')
        .text('EMPLOYMENT OFFER LETTER', margin, doc.y, { align: 'right', width: contentWidth });

      // ─── RECIPIENT DETAILS ───
      doc.moveDown(1);
      doc.fontSize(10).font('Helvetica').fillColor('#333333')
        .text(`Date: ${today}`)
        .moveDown(0.5)
        .font('Helvetica-Bold').fillColor('#000000').text(`Mr./Ms. ${fullName}`)
        .font('Helvetica').fillColor('#444444')
        .text(`${profile?.current_address || 'Candidate Address'}`)
        .text(`${profile?.city || user.country || 'City, Country'}`);

      // ─── SALUTATION & OPENING ───
      doc.moveDown(2);
      doc.font('Helvetica-Bold').fillColor('#000000').text(`Dear ${fullName},`);
      doc.moveDown(0.5);
      doc.font('Helvetica').fillColor('#333333').text(
        `We are pleased to offer you the position of ${application.desired_position || 'Production Worker'} at Barry Group Inc. at our facility in Corner Brook, Newfoundland and Labrador, Canada.`,
        { width: contentWidth, align: 'justify', lineGap: 2 }
      );

      // ─── JOB DETAILS TABLE ───
      doc.moveDown(1.5);
      
      const jobDetails = [
        ['Position:', application.desired_position || 'Production Worker'],
        ['Department:', 'Operations / Processing'],
        ['Location:', 'Corner Brook, NL, Canada'],
        ['Employment Type:', 'Full-time, Permanent'],
        ['Start Date:', 'As mutually agreed upon approval'],
        ['Working Hours:', '40 hours per week'],
        ['Wage:', `CAD $${application.hourly_wage || '16.50'} per hour`],
        ['Benefits:', 'Health & Dental Insurance, Paid Vacation, Employee Assistance Program']
      ];

      const startX = margin + 10;
      jobDetails.forEach(([label, value]) => {
        doc.font('Helvetica-Bold').fillColor('#000000').text(label, startX, doc.y, { continued: true, width: 130 });
        doc.font('Helvetica').fillColor('#333333').text(value, { width: contentWidth - 130 });
        doc.moveDown(0.4);
      });

      // ─── TERMS AND CONDITIONS ───
      doc.moveDown(1.2);
      doc.font('Helvetica').fillColor('#333333').text(
        'This offer is conditional upon the successful completion of background checks and your ability to obtain the necessary work authorization to work in Canada.',
        { width: contentWidth, align: 'justify', lineGap: 2 }
      );
      doc.moveDown(0.8);
      doc.text(
        'We will be applying for a Labour Market Impact Assessment (LMIA) to support your work permit application.',
        { width: contentWidth, align: 'justify' }
      );
      doc.moveDown(0.8);
      doc.text(
        'Please sign and return a copy of this letter to confirm your acceptance.',
        { width: contentWidth }
      );

      // ─── SIGNATURE / SIGN-OFF AREA ───
      doc.moveDown(2.5);
      if (doc.y > doc.page.height - 150) { doc.addPage(); } 

      doc.font('Helvetica').text('Sincerely,');
      doc.moveDown(1.8); // Blank space reserved for real signature signature and layout compliance
      
      doc.font('Helvetica-Bold').fillColor('#000000').text('Emira J. Kadiric')
        .font('Helvetica').fillColor('#555555').text('Chief Executive Officer / HR Lead')
        .text('Barry Group Inc.')
        .text('Email: hr@barrygroup.ca');

      // ─── FOOTER ───
      const footerY = doc.page.height - 45;
      
      // Footer Accent Line
      doc.rect(margin, footerY - 8, contentWidth, 0.5).fill('#dddddd');
      
      doc.fontSize(8).fillColor('#777777')
        .text('Page 1 of 1', margin, footerY, { align: 'center', width: contentWidth });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = { generateOfferLetter };
