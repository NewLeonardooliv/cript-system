import forge from 'node-forge';
import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();

        const privateKeyFile = formData.get('privateKeyRecipient'); // PEM da chave privada do destinatário
        const publicKeySenderFile = formData.get('publicKeySender'); // PEM da chave pública do remetente
        const encryptedFile = formData.get('encryptedFile'); // Arquivo cifrado (Base64)
        const signature = formData.get('signature'); // Assinatura digital (Base64)
        const encryptedAesKey = formData.get('encryptedAesKey'); // Chave AES cifrada (Base64)

        if (
            !privateKeyFile ||
            !(privateKeyFile instanceof Blob) ||
            !publicKeySenderFile ||
            !(publicKeySenderFile instanceof Blob) ||
            !encryptedFile ||
            typeof encryptedFile !== 'string' ||
            !signature ||
            typeof signature !== 'string' ||
            !encryptedAesKey ||
            typeof encryptedAesKey !== 'string'
        ) {
            return NextResponse.json(
                {
                    error: 'Chave privada, chave pública ou dados do pacote não fornecidos.',
                },
                { status: 400 }
            );
        }

        const privateKeyPem = await privateKeyFile.text();
        const publicKeySenderPem = await publicKeySenderFile.text();

        const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
        const publicKeySender = forge.pki.publicKeyFromPem(publicKeySenderPem);

        const aesKeyBinary = privateKey.decrypt(
            forge.util.decode64(encryptedAesKey)
        );
        const aesKey = Buffer.from(aesKeyBinary, 'binary');

        const encryptedFileBuffer = Buffer.from(encryptedFile, 'base64');
        const decipher = crypto.createDecipheriv(
            'aes-256-gcm',
            aesKey,
            encryptedFileBuffer.slice(0, 12)
        );
        const decryptedFile = Buffer.concat([
            decipher.update(encryptedFileBuffer.slice(12)),
            decipher.final(),
        ]);

        const hash = crypto.createHash('sha256').update(decryptedFile).digest();
        const isValid = publicKeySender.verify(
            forge.md.sha256
                .create()
                .update(hash.toString('binary'))
                .digest()
                .bytes(),
            forge.util.decode64(signature)
        );

        if (!isValid) {
            return NextResponse.json(
                { error: 'A assinatura digital é inválida.' },
                { status: 400 }
            );
        }

        return NextResponse.json({
            file: decryptedFile.toString('utf-8'),
            validation: 'Assinatura digital válida.',
        });
    } catch (error) {
        console.error('Erro ao processar a requisição:', error);
        return NextResponse.json(
            { error: 'Erro ao processar a requisição.' },
            { status: 500 }
        );
    }
}
