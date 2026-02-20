export async function parseImage(buffer: Buffer, mimeType: string): Promise<string> {
    // For images, we don't extract raw text ourselves.
    // Instead, we convert to a base64 string that Claude's Vision API can read directly.
    return `data:${mimeType};base64,${buffer.toString('base64')}`;
}
