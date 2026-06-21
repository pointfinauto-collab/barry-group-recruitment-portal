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

      doc.fontSize(7.5).fillColor('
