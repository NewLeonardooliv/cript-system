import crypto from 'crypto';

export async function GET() {
    try {
        const keyLength = 256; 
        const keyBytes = keyLength / 8;

        const key = crypto.randomBytes(keyBytes);

        const aesKeyHex = key.toString('hex');

        // const fileContent = `AES Key (${keyLength}-bit):\n${aesKeyHex}`;

        return new Response(aesKeyHex, {
            headers: {
                'Content-Disposition': 'attachment; filename="aes_key.txt"',
                'Content-Type': 'text/plain',
            },
        });
    } catch (error) {
        console.error('Erro ao gerar chave AES:', error);

        return new Response(
            JSON.stringify({ error: 'Erro ao gerar chave AES.' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
}
