const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Target the new PNG logo file directly
const logoPath = path.join(__dirname, '../../uploads/barry-group-logo.png');

const generateOfferLetter = (application, user, profile, lmiaNumber) => {
  return new Promise((resolve, reject) => { 
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 40 });
      const chunks = [];
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const pageWidth = doc.page.width;
      const margin = 40;
      const contentWidth = pageWidth - margin * 2;
      const refNumber = lmiaNumber || `BGI-${new Date().getFullYear()}-${Math.floor(Math.random() * 900000 + 100000)}`;
      const appNumber = application.application_number || 'N/A';

      // ─── BARCODE AREA (top) ───
      doc.rect(margin, 20, contentWidth, 18).fill('#000000');
      doc.fontSize(7).fillColor('#ffffff').font('Helvetica')
        .text(`|||||||||||||||||||||||||||||||||||||||||||||||||||  ${appNumber}`, margin + 5, 25, { width: contentWidth - 10 });

      doc.moveDown(0.5);
      
      // ─── HEADER AREA (Adjusted for wide logo) ───
      let headerTextY = 52; 

      if (fs.existsSync(logoPath)) {
        try {
          // Native PDFKit image processing (no sharp library required)
          doc.image(logoPath, margin, 48, { width: 220 });
          headerTextY = 52; 
        } catch (imageErr) {
          console.error("PDFKit failed to parse the logo file, using text fallback:", imageErr.message);
          renderTextFallback(doc, margin, 48);
        }
      } else {
        renderTextFallback(doc, margin, 48);
      }

      // Metadata placed to the right of the wide logo layout
      doc.fontSize(11).fillColor('#000000').font('Helvetica-Bold')
        .text('LABOUR MARKET IMPACT ASSESSMENT FOR SMT#', margin + 240, headerTextY, { width: contentWidth - 240 });
      doc.fontSize(13).fillColor('#cc0000').font('Helvetica-Bold')
        .text(refNumber, margin + 240, doc.y + 5);

      // Give enough vertical spacing before starting the document body
      doc.y = 120;

      // ANNEXA
      doc.fontSize(11).fillColor('#000000').font('Helvetica-Bold')
        .text('ANNEXA', margin, doc.y, { align: 'center', width: contentWidth });

      doc.moveDown(0.6);

      // ─── INFO BOX ───
      doc.fontSize(9).fillColor('#000000').font('Helvetica');

      const infoLines = [
        ['System File Number', appNumber],
        ['Service Canada Center', 'BARRY GROUP WORKER REQUIREMENT BRANCH'],
        ['Service Canada Office', 'CORNER BROOK, NL'],
        ['Opinion Expiry Date', '2026-12-31'],
      ];

      infoLines.forEach(([label, value]) => {
        doc.font('Helvetica').fillColor('#000000').text(label, margin, doc.y, { continued: true, width: 160 });
        doc.font('Helvetica').text(`  ${value}`, { width: contentWidth - 160 });
        doc.moveDown(0.25);
      });

      doc.moveDown(0.3);
      doc.fontSize(8).fillColor('#000000').font('Helvetica').font('Helvetica-Oblique')
        .text('Note that the Foreign Worker must apply to CIC for a work permit prior to this date.', margin, doc.y, { width: contentWidth });

      doc.moveDown(0.6);

      // ─── EMPLOYER INFORMATION ───
      doc.fontSize(10).fillColor('#000000').font('Helvetica-Bold')
        .text('Employer Information', margin, doc.y);
      doc.moveDown(0.3);
      doc.rect(margin, doc.y, contentWidth, 1).fill('#000000');
      doc.moveDown(0.3);

      doc.fontSize(9).font('Helvetica');
      const empLines = [
        ['Employer ID', '247785***'],
        ['Employer Name', 'Barry Group Inc.'],
        ['Contact Person', 'Emira J. Kadiric — Chief Executive Officer'],
      ];
      empLines.forEach(([label, value]) => {
        doc.font('Helvetica').fillColor('#000000').text(label, margin, doc.y, { continued: true, width: 160 });
        doc.font('Helvetica').text(`  ${value}`, { width: contentWidth - 160 });
        doc.moveDown(0.25);
      });

      doc.moveDown(0.2);
      doc.fontSize(8).font('Helvetica-Oblique')
        .text('Please take note of this number for future reference as this will help in the processing of any future foreign work request.', margin, doc.y, { width: contentWidth });

      doc.moveDown(0.6);

      // ─── EMPLOYEE CONTRACT(S) ───
      doc.fontSize(10).fillColor('#000000').font('Helvetica-Bold')
        .text('Employee Contract(s)', margin, doc.y);
      doc.moveDown(0.3);
      doc.rect(margin, doc.y, contentWidth, 1).fill('#000000');
      doc.moveDown(0.3);

      doc.fontSize(9).font('Helvetica');
      doc.text('Contract Name', margin, doc.y, { continued: true, width: 160 });
      doc.font('Helvetica-Bold').text(`  ${application.desired_position || 'As Discussed'}`, { width: contentWidth - 160 });
      doc.moveDown(0.25);

      doc.font('Helvetica');
      const contractLines = [
        ['Third Party Information', ''],
        ['Third Party ID', '2543212****'],
        ['Third Party Company', 'Barry Group Inc. & Associates'],
        ['Name of Representative', 'Emira J. Kadiric'],
      ];
      contractLines.forEach(([label, value]) => {
        if (value) {
          doc.text(label, margin, doc.y, { continued: true, width: 160 });
          doc.text(`  ${value}`, { width: contentWidth - 160 });
        } else {
          doc.text(label, margin, doc.y);
        }
        doc.moveDown(0.25);
      });

      doc.moveDown(0.2);
      doc.fontSize(8).font('Helvetica-Oblique')
        .text('*Please take note of this number for future reference as this will help in the processing of any future foreign work or request.', margin, doc.y, { width: contentWidth });

      doc.moveDown(0.6);

      // ─── WORKERS INFORMATION ───
      doc.fontSize(10).fillColor('#000000').font('Helvetica-Bold')
        .text('Workers Information', margin, doc.y);
      doc.moveDown(0.3);
      doc.rect(margin, doc.y, contentWidth, 1).fill('#000000');
      doc.moveDown(0.3);

      const col1 = margin;
      const col2 = margin + 110;
      const col3 = margin + 230;

      doc.fontSize(9).font('Helvetica-Bold');
      doc.text('Last Name', col1, doc.y);
      doc.text('First Name', col2, doc.y - 10);
      doc.text('Passport', col3, doc.y - 10);
      doc.moveDown(0.3);
      doc.rect(margin, doc.y, contentWidth, 0.5).fill('#000000');
      doc.moveDown(0.3);

      doc.fontSize(9).font('Helvetica');
      const lastName = user.last_name?.toUpperCase() || 'N/A';
      const firstName = user.first_name?.toUpperCase() || 'N/A';
      const passport = profile?.passport_number || 'N/A';

      doc.text(lastName, col1, doc.y);
      doc.text(firstName, col2, doc.y - 10);
      doc.text(passport, col3, doc.y - 10);
      doc.moveDown(0.5);

      const workerDetails = [
        ['Nationality', profile?.nationality || user.country || 'N/A'],
        ['Job Information', application.desired_position || 'N/A'],
        ['NOC Code', '7736'],
        ['Name of position', `${application.desired_position || 'Worker'} [As require by the Employer]`],
        ['Level of Education', profile?.education_level || 'As per applicant profile'],
        ['Language Requirements', ''],
        ['  Oral', 'English'],
        ['  Written', 'English'],
        ['Regulatory Body Duration', 'This occupation is not regulated'],
        ['Of Employment Wage', `As per Canadian labor standards`],
        ['  Benefits', `Health, dental, housing assistance`],
        ['  Hours of work', '40 Hours per Month minimum'],
        ['', `CAD $${application.salary_range || '36,000 - 85,000'} Year(s) per Year`],
        ['Location(s) of Employment', `415 Griffin Dr, Corner Brook, NL A2H 3E9, Canada`],
      ];

      workerDetails.forEach(([label, value]) => {
        if (!label && !value) {
          doc.moveDown(0.2);
          return;
        }
        doc.fontSize(9).font('Helvetica').fillColor('#000000');
        if (value) {
          doc.text(label, margin, doc.y, { continued: true, width: 180 });
          doc.text(`  ${value}`, { width: contentWidth - 180 });
        } else {
          doc.text(label, margin, doc.y);
        }
        doc.moveDown(0.25);
      });

      doc.moveDown(0.5);

      // ─── ANNEX NOTE ───
      doc.fontSize(8).font('Helvetica-Oblique').fillColor('#000000')
        .text('Annex Foot note: This confirmation is valid only inside Canada.', margin, doc.y)
        .text('Find NOC code: http://www.esdc.gc.ca', margin, doc.y + 10);

      doc.moveDown(1);

      // ─── FOOTER BOX ───
      const footerY = doc.page.height - 80;

      doc.fontSize(9).font('Helvetica-Bold').fillColor('#cc0000')
        .text('Barry Group Inc.', margin, footerY);
      doc.fontSize(8).font('Helvetica').fillColor('#000000')
        .text('415 Griffin Dr, Corner Brook, NL A2H 3E9, Canada', margin, footerY + 12)
        .text('Tel: barrygroup.ltd.inc@gmail.com', margin, footerY + 22);

      doc.fontSize(8).font('Helvetica').fillColor('#000000')
        .text('Page 1 of 1', margin, footerY + 35, { align: 'center', width: contentWidth });

      doc.rect(margin, footerY + 50, contentWidth, 1).fill('#cc0000');

      doc.fontSize(14).fillColor('#cc0000').font('Helvetica-Bold')
        .text('Canada', pageWidth - margin - 80, footerY + 5);

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

function renderTextFallback(doc, margin, startY) {
  doc.fontSize(14).fillColor('#000000').font('Helvetica-Bold')
    .text('BARRY GROUP INC.', margin, startY);
}

module.exports = { generateOfferLetter };
