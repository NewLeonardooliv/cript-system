'use client';

import { motion } from 'framer-motion';
import { FileLock, FileSignature, Info, ShieldPlus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEffect, useRef, useState } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';

export function StepProtection({
    stepData,
    setStepData,
    setStepReady
}: { stepData: any, setStepData: (data: any) => void, setStepReady: (value: boolean) => void }) {
    const [isProtectingFile, setIsProtectingKey] = useState(false);
    const protectingAnimationRef = useRef<Player>(null);
    const [protectedData, setProtectedData] = useState<string | null>(null);
    const [actionText, setActionText] = useState<string>('Proteger a chave');


    const protectKey = async () => {
        setIsProtectingKey(true);

        setActionText('Protegendo...');

        protectingAnimationRef.current?.play();

        await new Promise((resolve) => setTimeout(resolve, 2000));

        const simulatedProtect = btoa('Chave AES protegida');
        setProtectedData(simulatedProtect);
        setStepData({ ...stepData, signature: simulatedProtect });

        setIsProtectingKey(false);

        setActionText('Chave protegida');
    };

    useEffect(() => {
        if (protectedData) {
            setStepReady(true);
        } else {
            setStepReady(false);
        }
    }, [protectedData]);

    return (
        <div className="space-y-10 w-full">
            <motion.div
                className='text-center'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h2 className="text-2xl font-bold mb-4">Proteção da Chave Simétrica</h2>
                <p className="text-gray-600 mb-8">
                    A chave AES é protegida ao ser criptografada com a chave pública RSA, garantindo acesso apenas ao detentor da chave privada.
                </p>
            </motion.div>
            <div className="flex flex-col justify-between items-center gap-12">
                <Player
                    ref={protectingAnimationRef}
                    src="https://lottie.host/ed89951f-b11e-4e2a-92da-c482e1498d66/KQFMNqk8J6.json"
                    style={{
                        height: '150px',
                        width: '150px',
                    }}
                    keepLastFrame={true}
                    loop={false}
                />

                <div className='w-full'>
                    <Button
                        className="w-fit px-6 rounded-none rounded-t-lg w-full"
                        onClick={protectKey}
                        disabled={isProtectingFile || protectedData !== null}
                    >
                        <ShieldPlus className="w-4 h-4" />
                        {actionText}
                    </Button>

                    <Card className='w-full rounded-none shadow-none'>
                        <CardContent className="p-4 bg-white border-blue-100 rounded-b-lg w-full">
                            <div className="flex flex-col justify-center w-full">
                                <h3 className="text-sm font-medium text-blue-700 mb-2">
                                    Como funciona?
                                </h3>

                                <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
                                    <li>Criptografia Simétrica (AES): A chave AES é gerada e usada para criptografar os dados, garantindo alto desempenho no processamento.</li>
                                    <li>Proteção da Chave AES: A chave AES é criptografada usando a chave pública RSA, protegendo-a contra acesso não autorizado.</li>
                                    <li>Descriptografia Segura: O receptor usa sua chave privada RSA para descriptografar a chave AES e, com ela, decifrar os dados originalmente protegidos.</li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className='w-full rounded-none rounded-b-lg shadow-none'>
                        <CardContent className="mb-4 p-4 bg-white border-blue-100 rounded-b-lg w-full">
                            <div className="flex flex-col justify-center w-full">
                                <h3 className="text-sm font-medium text-blue-700 mb-2">
                                    Por que a chave simétrica?
                                </h3>

                                <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
                                    <li>Desempenho e Velocidade: Criptografia simétrica (como AES) é muito mais rápida que algoritmos assimétricos, tornando-a ideal para grandes volumes de dados.</li>
                                    <li>Eficiência Computacional: Requer menos recursos computacionais, o que é vantajoso em dispositivos com capacidade limitada.</li>
                                    <li>Simplicidade na Implementação: A utilização de uma única chave simplifica o processo de criptografia e descriptografia.</li>
                                    <li>Segurança Robusta: Quando usada com chaves fortes e bem gerenciadas, a criptografia simétrica oferece proteção eficaz contra ataques.</li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div >
    );
}
