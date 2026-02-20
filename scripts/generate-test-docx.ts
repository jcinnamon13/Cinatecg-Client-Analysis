import { Document, Packer, Paragraph, TextRun } from "docx";
import * as fs from "fs";

const doc = new Document({
    sections: [
        {
            properties: {},
            children: [
                new Paragraph({
                    children: [
                        new TextRun({ text: "Client Name: Horizon Retail", bold: true }),
                    ],
                }),
                new Paragraph({
                    children: [
                        new TextRun({ text: "Industry: E-commerce / Brick & Mortar", bold: true }),
                    ],
                }),
                new Paragraph(""),
                new Paragraph({
                    children: [
                        new TextRun({ text: "Q: What are your 3 main business goals for the next 12 months?", bold: true }),
                    ],
                }),
                new Paragraph({
                    children: [
                        new TextRun("A: 1. Try to sell more online. 2. Get people to come into the store. 3. Stop losing money on shipping."),
                    ],
                }),
                new Paragraph(""),
                new Paragraph({
                    children: [
                        new TextRun({ text: "Q: What is your biggest current challenge?", bold: true }),
                    ],
                }),
                new Paragraph({
                    children: [
                        new TextRun("A: We spend too much on ads but sales are the same."),
                    ],
                }),
                new Paragraph(""),
                new Paragraph({
                    children: [
                        new TextRun({ text: "Q: Who is your target audience?", bold: true }),
                    ],
                }),
                new Paragraph({
                    children: [
                        new TextRun("A: Everyone who likes clothes, probably moms mostly."),
                    ],
                }),
            ],
        },
    ],
});

Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync("test-client-doc.docx", buffer);
    console.log("Document created successfully");
});
