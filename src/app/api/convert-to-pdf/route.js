import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Using ConvertAPI
    const response = await axios.post(
      'https://v2.convertapi.com/convert/docx/to/pdf',
      {
        Parameters: [
          {
            Name: 'File',
            FileValue: {
              Name: file.name,
              Data: buffer.toString('base64')
            }
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        params: {
          Secret: 'token_QIM1NygB'
        },
        responseType: 'arraybuffer'
      }
    );

    return new NextResponse(response.data, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=converted.pdf'
      }
    });

  } catch (err) {
    console.error('Conversion error:', err);
    return NextResponse.json(
      { error: 'Failed to convert document' },
      { status: 500 }
    );
  }
}