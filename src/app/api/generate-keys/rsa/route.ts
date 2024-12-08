import { NextResponse } from 'next/server';
import forge from 'node-forge';

let generatedKeys: { publicKey: string; privateKey: string } | null = null;

export async function GET() {
    try {
        const bits = 2048;
        const e = 0x10001;

        const keypair = forge.pki.rsa.generateKeyPair({ bits, e });
        const publicKeyPem = forge.pki.publicKeyToPem(keypair.publicKey);
        const privateKeyPem = forge.pki.privateKeyToPem(keypair.privateKey);

        generatedKeys = {
            publicKey: publicKeyPem,
            privateKey: privateKeyPem,
        };

        return NextResponse.json(generatedKeys, { status: 200 });
    } catch (error) {
        console.error('Erro ao gerar chaves RSA:', error);

        return NextResponse.json(
            { error: 'Erro ao gerar chaves RSA.' },
            { status: 500 }
        );
    }
}
