import crypto from 'crypto';
import forge from 'node-forge';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();

        const privateKeyFile = formData.get('privateKeySender'); // PEM da chave privada do remetente
        const publicKeyRecipientFile = formData.get('publicKeyDestination'); // PEM da chave pública do destinatário
        const file = formData.get('file');
        const aesKeyHex = formData.get('aesKey'); // Chave AES enviada como string

        if (
            !privateKeyFile ||
            !(privateKeyFile instanceof Blob) ||
            !publicKeyRecipientFile ||
            !(publicKeyRecipientFile instanceof Blob) ||
            !file ||
            !(file instanceof Blob) ||
            !aesKeyHex ||
            typeof aesKeyHex !== 'string'
        ) {
            return NextResponse.json(
                {
                    error: 'Chave privada, chave pública, arquivo ou chave AES não fornecidos.',
                },
                { status: 400 }
            );
        }

        // Conversão da chave AES para Buffer
        const aesKey = Buffer.from(aesKeyHex, 'hex');

        const privateKeyPem = await privateKeyFile.text();
        const publicKeyRecipientPem = await publicKeyRecipientFile.text();
        const fileContent = await file.arrayBuffer();
        const fileBuffer = Buffer.from(fileContent);

        const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
        const publicKeyRecipient = forge.pki.publicKeyFromPem(
            publicKeyRecipientPem
        );

        // 1. Assinatura Digital
        const hash = crypto.createHash('sha256').update(fileBuffer).digest();
        const signature = privateKey.sign(
            forge.md.sha256.create().update(hash.toString('binary'))
        );

        // 2. Cifragem Simétrica
        const cipher = crypto.createCipheriv(
            'aes-256-gcm',
            aesKey,
            crypto.randomBytes(12)
        );
        const encryptedFile = Buffer.concat([
            cipher.update(fileBuffer),
            cipher.final(),
        ]);

        // 3. Cifrar a chave AES com a chave pública do destinatário
        const encryptedKey = publicKeyRecipient.encrypt(
            aesKey.toString('binary')
        );

        // Retorna o pacote criptografado
        return NextResponse.json({
            encryptedFileInBase64: encryptedFile.toString('base64'),
            encryptedKeyInBase64: forge.util.encode64(encryptedKey),
            signatureInBase64: forge.util.encode64(signature),
        });
    } catch (error) {
        console.error('Erro ao processar a requisição:', error);
        return NextResponse.json(
            { error: 'Erro ao processar a requisição.' },
            { status: 500 }
        );
    }
}
