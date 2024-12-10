import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Key } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import FileUploader from '@/components/file-uploader';

export function StepDecrypt({
    stepData,
    setStepData,
    setStepReady
}: { stepData: any, setStepData: (data: any) => void, setStepReady: (value: boolean) => void }) {
    const [privateKey, setPrivateKey] = useState<File | null>(null);
    const [actionText, setActionText] = useState<string>('Descriptografar Arquivo');
    const [data, setData] = useState<string | null>(null);



    const handleDecrypt = async () => {
        setActionText('Descriptografando...');

        await new Promise((resolve) => setTimeout(resolve, 2000));

        const simulatedData = btoa('Chave AES protegida');
        setData(simulatedData);
        setStepData({ ...stepData, signature: simulatedData });

        setActionText('Arquivo descriptografado');
    };

    const handleFileSelect = async (file: File) => {
        if (!file) return;

        setPrivateKey(file);
    };

    useEffect(() => {
        if (privateKey) {
            setStepReady(true);
        } else {
            setStepReady(false);
        }
    }, [privateKey]);

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
                        <FileUploader
                            label='Importe a chave privada (RSA) do professor'
                            filesTypeAccepted={['pem', 'key', 'pub']}
                            handleFileSelect={(file) => handleFileSelect(file)} />
                    </div>
                </div>

                <Button
                    className="w-full mt-6"
                    onClick={handleDecrypt}
                    disabled={!privateKey}
                >
                    {actionText}
                </Button>
            </div>
        </motion.div>
    );
}
