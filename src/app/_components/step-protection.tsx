'use client';

import { motion } from 'framer-motion';
import { FileSignature, Lightbulb } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRef, useState } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';

export const StepProtection: React.FC<{
    stepData: any;
    setStepData: (data: any) => void;
}> = ({ stepData, setStepData }) => {
    const [isProtectingFile, setIsProtectingKey] = useState(false);
    const protectingAnimationRef = useRef<Player>(null);
    const [protectedData, setProtectedData] = useState<string | null>(null);


    const signFile = async () => {
        setIsProtectingKey(true);
        protectingAnimationRef.current?.play();

        await new Promise((resolve) => setTimeout(resolve, 2000));

        const simulatedSignature = btoa('Arquivo Assinado Digitalmente');
        setProtectedData(simulatedSignature);
        setStepData({ ...stepData, signature: simulatedSignature });

        setIsProtectingKey(false);
        protectingAnimationRef.current?.stop();
    };

    return (
        <div className="space-y-10 w-full">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
            >
                <h2 className="text-2xl font-bold mb-4">Proteção da Chave Simétrica</h2>
                <p className="text-gray-600 mb-8">
                    Gere as chaves necessárias para a comunicação segura
                </p>
            </motion.div>
            <div className="grid grid-cols-1 gap-8">
                <Card>
                    <CardContent className="p-6 bg-blue-100 rounded-lg">
                        <div className="flex flex-col justify-center gap-4">
                            <div className="flex items-center gap-2">
                                <Lightbulb className="w-5 h-5 text-yellow-500" />
                                <h3 className="font-semibold">
                                    Como funciona?
                                </h3>
                            </div>

                            <ul className="list-disc list-inside flex flex-col gap-2">
                                <li>A chave AES é cifrada com a chve pública do professor</li>
                                <li>Apenas o professor, com sua chave privada, porá descriptografar o conteúdo</li>
                                <li>Este processo garante o compartilhamento seguro da chave</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>

                <Card className='rounded-none border-none shadow-none'>
                    <CardContent className="border-l-4 border-blue-600 p-6">
                        <div className="flex flex-col justify-center gap-4">
                            <h3 className="font-semibold">
                                Por que a chave simétrica?
                            </h3>

                            <ul className="list-disc list-inside flex flex-col gap-2">
                                <li>A chave AES é usada para cifrar o arquivo principal</li>
                                <li>Ela precisa ser compartilhada com o professor de forma segura</li>
                                <li>Aproteção é feita utilizando criptografia assimétrica RSA</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-center mb-4">
                    <Player
                        ref={protectingAnimationRef}
                        src="https://lottie.host/ed89951f-b11e-4e2a-92da-c482e1498d66/KQFMNqk8J6.json"
                        style={{
                            height: '150px',
                            width: '150px',
                            display: isProtectingFile ? 'block' : 'none',
                        }}
                    />
                </div>

                <Button
                    className="w-full"
                    onClick={signFile}
                    disabled={isProtectingFile || protectedData !== null}
                >
                    <FileSignature className="w-4 h-4" />
                    {isProtectingFile ? 'Assinando...' : 'Assinar Arquivo'}
                </Button>
            </div>
        </div>
    );
}
