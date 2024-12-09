import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Key } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export function StepDecrypt() {
    const [privateKey, setPrivateKey] = useState('');
    const [isDecrypting, setIsDecrypting] = useState(false);

    const handleDecrypt = () => {
        if (!privateKey.trim()) {
            toast.error('Por favor, insira a chave privada');
            return;
        }

        setIsDecrypting(true);
        setTimeout(() => {
            setIsDecrypting(false);
            toast.success('Arquivo descriptografado com sucesso!');
        }, 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 w-full max-w-3xl mx-auto"
        >
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Verificação e Descriptografia</h2>
                <p className="text-gray-600">
                    O professor precisa usar sua chave privada RSA para iniciar o processo de descriptografia e verificação do arquivo recebido.
                </p>
            </div>

            <div className="bg-white p-6 rounded-lg border shadow-sm">
                <div className="mb-8">
                    <h3 className="font-semibold mb-4">Processo de descriptografia:</h3>
                    <ul className="space-y-3">
                        <li className="flex items-start gap-2 text-sm text-gray-600">
                            <span className="font-medium text-blue-600">•</span>
                            Primeiro, o professor fornece sua chave privada RSA
                        </li>
                        <li className="flex items-start gap-2 text-sm text-gray-600">
                            <span className="font-medium text-blue-600">•</span>
                            A chave privada é usada para recuperar a chave simétrica AES
                        </li>
                        <li className="flex items-start gap-2 text-sm text-gray-600">
                            <span className="font-medium text-blue-600">•</span>
                            Com a chave AES, o arquivo pode ser descriptografado
                        </li>
                        <li className="flex items-start gap-2 text-sm text-gray-600">
                            <span className="font-medium text-blue-600">•</span>
                            Por fim, a assinatura digital é verificada
                        </li>
                    </ul>
                </div>

                <div className="space-y-4">
                    <label className="block text-sm font-medium">
                        Chave Privada do Professor:
                    </label>
                    <div className="relative">
                        <textarea
                            className="w-full h-24 p-3 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Cole aqui sua chave privada RSA..."
                            value={privateKey}
                            onChange={(e) => setPrivateKey(e.target.value)}
                        />
                        <Key className="absolute right-3 top-3 text-gray-400 w-5 h-5" />
                    </div>
                </div>

                <Button
                    className="w-full mt-6"
                    onClick={handleDecrypt}
                    disabled={isDecrypting}
                >
                    {isDecrypting ? 'Descriptografando...' : 'Iniciar Descriptografia'}
                </Button>
            </div>
        </motion.div>
    );
}
