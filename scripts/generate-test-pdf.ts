import PDFDocument from 'pdfkit';
import fs from 'fs';

const doc = new PDFDocument();
doc.pipe(fs.createWriteStream('test-client-doc.pdf'));

doc.fontSize(20).text('Client Name: Horizon Retail', { underline: true });
doc.fontSize(14).text('Industry: E-commerce / Brick & Mortar');
doc.moveDown();

doc.fontSize(16).text('Q: What are your 3 main business goals for the next 12 months?');
doc.fontSize(12).text('A: 1. Try to sell more online. 2. Get people to come into the store. 3. Stop losing money on shipping.');
doc.moveDown();

doc.fontSize(16).text('Q: What is your biggest current challenge?');
doc.fontSize(12).text('A: We spend too much on ads but sales are the same.');
doc.moveDown();

doc.fontSize(16).text('Q: Who is your target audience?');
doc.fontSize(12).text('A: Everyone who likes clothes, probably moms mostly.');

doc.end();
console.log('PDF created successfully.');
