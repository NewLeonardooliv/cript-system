import { NextResponse, NextRequest } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();

        const publicKeyFile = formData.get('publicKey');
        if (!publicKeyFile || !(publicKeyFile instanceof Blob)) {
            return NextResponse.json(
                { error: 'Chave pública não fornecida ou inválida.' },
                { status: 400 }
            );
        }

        // Lê o conteúdo da chave pública
        const publicKeyContent = await publicKeyFile.text();
        if (!publicKeyContent.includes('-----BEGIN PUBLIC KEY-----')) {
            return NextResponse.json(
                { error: 'Formato da chave pública inválido.' },
                { status: 400 }
            );
        }

        const file = formData.get('file');
        if (!file || !(file instanceof Blob)) {
            return NextResponse.json(
                { error: 'Arquivo não fornecido ou inválido.' },
                { status: 400 }
            );
        }

        const fileName = file.name || 'arquivo';
        const fileContent = await file.arrayBuffer();
        const fileBuffer = Buffer.from(fileContent);

        const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

        const isTextFile = file.type && file.type.startsWith('text/');
        let fileTextContent = null;
        if (isTextFile) {
            fileTextContent = fileBuffer.toString('utf-8');
        }

        return NextResponse.json({
            publicKey: publicKeyContent,
            file: {
                name: fileName,
                type: file.type,
                size: fileBuffer.length,
                content: isTextFile ? fileTextContent : 'Arquivo não é texto.',
            },
            hash,
        });
    } catch (error) {
        console.error('Erro ao processar a requisição:', error);
        return NextResponse.json(
            { error: 'Erro ao processar a requisição.' },
            { status: 500 }
        );
    }
}
