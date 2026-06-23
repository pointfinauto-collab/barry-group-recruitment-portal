const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Asset paths
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

      // Right: Company Details (Updated Email and URL)
      doc.fontSize(8).fillColor('#444444').font('Helvetica')
        .text('415 Griffin Dr, Corner Brook', pageWidth - margin - 220, 42, { align: 'right', width: 220 })
        .text('Newfoundland and Labrador, A2H 3E9', { align: 'right', width: 220 })
        .text('Email: barrygroup.ltd.inc@gmail.com', { align: 'right', width: 220 })
        .text('https://barry-group-frontend.onrender.com/', { align: 'right', width: 220 });

      // Horizontal divider line 
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

      // ─── SIGNATURE & STAMP AREA ───
      doc.moveDown(2);
      if (doc.y > doc.page.height - 180) { doc.addPage(); } 

      const signatureY = doc.y;

      // Left Column: Text Sign-off
      doc.font('Helvetica').fillColor('#333333').text('Sincerely,', margin, signatureY);
      doc.moveDown(0.5); 

      // Programmatically traces the specific cursive handwriting from "real lmia.jpg"
      drawMapleLeafSignature(doc, margin, doc.y);
      
      doc.moveDown(1.2);
      doc.font('Helvetica-Bold').fillColor('#000000').text('Emira J. Kadiric', margin, doc.y)
        .font('Helvetica').fillColor('#555555').text('Chief Executive Officer / HR Lead')
        .text('Barry Group Inc.')
        .text('Email: barrygroup.ltd.inc@gmail.com');

      // Right Column: Programmatic Vector Stamp
      const stampX = pageWidth - margin - 110;
      const stampCenterY = signatureY + 45;

      // Outer Circle
      doc.lineWidth(2).circle(stampX + 45, stampCenterY, 45).lineWidth(1.5).stroke('#0d3b66');
      // Inner Circle
      doc.circle(stampX + 45, stampCenterY, 35).lineWidth(0.75).stroke('#0d3b66');

      // Stamp Curved/Circular Top Text
      doc.fontSize(6).font('Helvetica-Bold').fillColor('#0d3b66')
        .text('BARRY GROUP INC.', stampX + 15, stampCenterY - 22, { width: 60, align: 'center' });
      
      // Stamp Center Core Content
      doc.fontSize(8).font('Helvetica-Bold')
        .text('OFFICIAL', stampX + 15, stampCenterY - 5, { width: 60, align: 'center' })
        .text('STAMP', stampX + 15, stampCenterY + 4, { width: 60, align: 'center' });

      // Stamp Bottom Text
      doc.fontSize(5.5).font('Helvetica')
        .text('CANADA', stampX + 15, stampCenterY + 22, { width: 60, align: 'center' });

      // ─── FOOTER ───
      const footerY = doc.page.height - 45;
      doc.rect(margin, footerY - 8, contentWidth, 0.5).fill('#dddddd');
      doc.fontSize(8).fillColor('#777777')
        .text('Page 1 of 1', margin, footerY, { align: 'center', width: contentWidth });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

function drawMapleLeafSignature(doc, x, y) {
  doc.save();
  doc.strokeColor('#1d2d42').lineWidth(1.2);
  
  doc.moveTo(x + 5, y + 25)
     .bezierCurveTo(x + 12, y - 5, x + 35, y, x + 18, y + 22)
     .bezierCurveTo(x + 8, y + 35, x + 2, y + 40, x + 12, y + 28)
     .bezierCurveTo(x + 22, y + 18, x + 26, y + 20, x + 32, y + 28)
     .bezierCurveTo(x + 36, y + 24, x + 38, y + 24, x + 44, y + 28)
     .moveTo(x + 52, y + 28)
     .lineTo(x + 58, y + 5)
     .lineTo(x + 66, y + 26)
     .lineTo(x + 72, y + 8)
     .bezierCurveTo(x + 76, y + 18, x + 82, y + 14, x + 90, y + 28)
     .bezierCurveTo(x + 94, y + 22, x + 102, y + 20, x + 110, y + 28)
     .bezierCurveTo(x + 95, y + 36, x + 50, y + 38, x + 118, y + 24);
     
  doc.stroke();
  doc.restore();
}

module.exports = { generateOfferLetter };
