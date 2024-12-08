import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET() {
    try {
        const keyLength = 256;
        const keyBytes = keyLength / 8;

        const key = crypto.randomBytes(keyBytes);

        const aesKeyHex = key.toString('hex');

        const generatedKeys = {
            key: aesKeyHex,
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
