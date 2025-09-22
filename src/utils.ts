import { createHash } from 'crypto';
import pdf from 'pdf-parse';

export function getFileChecksum(file: Express.Multer.File): string {
    const hash = createHash('sha256');
    hash.update(file.buffer);
    return hash.digest('hex');
}

export async function extractTextFromPdf(pdfBuffer: Buffer): Promise<string> {
    try {
        const data = await pdf(pdfBuffer);
        return data.text;
    } catch (error) {
        throw new Error(`Failed to extract text from PDF: ${error.message}`);
    }
}

export function getEnvOrFail(env: string): string {
    const value = process.env[env];
    if (!value) {
        throw new Error(`Environment variable ${env} is not set`);
    }
    return value;
}