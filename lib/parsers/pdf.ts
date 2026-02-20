import pdfParse from 'pdf-parse';

export async function parsePdf(buffer: Buffer): Promise<string> {
    try {
        console.log(`Parsing PDF buffer of size: ${buffer.length}`);
        // Ensure the buffer is explicitly a Node Buffer as required by pdf-parse
        const nodeBuffer = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);
        const data = await pdfParse(nodeBuffer);
        return data.text.trim();
    } catch (error) {
        console.error('PDF parsing error:', error);
        throw new Error('Failed to extract text from PDF document');
    }
}
