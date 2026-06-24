import { NextResponse } from 'next/server';
import libre from 'libreoffice-convert';
import fs from 'fs';
import path from 'path';
import os from 'os';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  let tempFilePath = null;
  
  try {
    const formData = await request.formData();
    const docxFile = formData.get('docxFile');
    
    if (!docxFile) {
      return NextResponse.json(
        { message: 'No DOCX file provided' }, 
        { status: 400 }
      );
    }

    // Create temporary file
    tempFilePath = path.join(os.tmpdir(), `convert-${Date.now()}.docx`);
    const buffer = Buffer.from(await docxFile.arrayBuffer());
    await fs.promises.writeFile(tempFilePath, buffer);

    // Read file and convert
    const docxBuffer = await fs.promises.readFile(tempFilePath);
    const pdfBuffer = await new Promise((resolve, reject) => {
      libre.convert(docxBuffer, '.pdf', undefined, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });

    // Clean up
    try {
      if (tempFilePath) await fs.promises.unlink(tempFilePath);
    } catch (cleanupError) {
      console.warn('Failed to clean up temp file:', cleanupError);
    }

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="converted.pdf"'
      }
    });

  } catch (error) {
    // Clean up temp file if error occurred
    if (tempFilePath) {
      try {
        await fs.promises.unlink(tempFilePath).catch(() => {});
      } catch (e) {}
    }
    
    console.error('Conversion error:', error);
    return NextResponse.json(
      { 
        message: 'Conversion failed',
        error: error.message,
        details: error.code === 'ENOENT' ? 
          'LibreOffice not installed. Please install LibreOffice.' : 
          error.toString()
      },
      { status: 500 }
    );
  }
}