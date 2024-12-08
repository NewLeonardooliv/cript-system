import { NextResponse } from 'next/server';
import forge from 'node-forge';
import AdmZip from 'adm-zip';

export async function GET() {
    try {
        const bits = 2048;
        const e = 0x10001;

        const keypair = forge.pki.rsa.generateKeyPair({ bits, e });
        const publicKeyPem = forge.pki.publicKeyToPem(keypair.publicKey);
        const privateKeyPem = forge.pki.privateKeyToPem(keypair.privateKey);

        const zip = new AdmZip();

        zip.addFile('public_key.pem', Buffer.from(publicKeyPem, 'utf-8'));

        zip.addFile('private_key.pem', Buffer.from(privateKeyPem, 'utf-8'));

        const zipBuffer = zip.toBuffer();

        return new Response(zipBuffer, {
            headers: {
                'Content-Disposition': 'attachment; filename="rsa_keys.zip"',
                'Content-Type': 'application/zip',
            },
        });
    } catch (error) {
        console.error('Erro ao gerar chaves RSA:', error);

        return NextResponse.json(
            { error: 'Erro ao gerar chaves RSA.' },
            { status: 500 }
        );
    }
}
