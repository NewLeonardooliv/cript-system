import { NextRequest, NextResponse } from 'next/server';
import AdmZip from 'adm-zip';

export async function POST(req: NextRequest) {
    try {
        const { encryptedFile, signature, encryptedAesKey } = await req.json();

        if (
            !encryptedFile ||
            typeof encryptedFile !== 'string' ||
            !signature ||
            typeof signature !== 'string' ||
            !encryptedAesKey ||
            typeof encryptedAesKey !== 'string'
        ) {
            return NextResponse.json(
                { error: 'Dados do pacote incompletos.' },
                { status: 400 }
            );
        }

        const zip = new AdmZip();
        zip.addFile('encrypted_file.bin', Buffer.from(encryptedFile, 'base64'));
        zip.addFile('signature.sig', Buffer.from(signature, 'base64'));
        zip.addFile(
            'encrypted_key.key',
            Buffer.from(encryptedAesKey, 'base64')
        );

        const zipBuffer = zip.toBuffer();

        return new Response(zipBuffer, {
            headers: {
                'Content-Disposition': 'attachment; filename="package.zip"',
                'Content-Type': 'application/zip',
            },
        });
    } catch (error) {
        console.error('Erro ao empacotar os dados:', error);
        return NextResponse.json(
            { error: 'Erro ao empacotar os dados.' },
            { status: 500 }
        );
    }
}
