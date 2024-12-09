'use client';

import { motion } from 'framer-motion';
import { FileSignature, Info } from 'lucide-react';
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
            >
                <h2 className="text-center text-2xl font-bold mb-4">Proteção da Chave Simétrica</h2>
                <p className="text-gray-600 mb-8">
                    A proteção de uma chave simétrica AES utilizando uma chave RSA combina o desempenho do AES com a segurança do RSA. Nesse esquema, o AES é usado para criptografar dados devido à sua eficiência, enquanto a chave simétrica gerada para o AES é protegida pela criptografia RSA. A chave pública RSA cifra a chave AES antes de transmissão ou armazenamento, garantindo que apenas o detentor da chave privada RSA possa descriptografá-la. Esse método, conhecido como criptografia híbrida, une a velocidade da criptografia simétrica à robustez da assimétrica, proporcionando alta segurança e eficiência.
                </p>
            </motion.div>
            <div className="grid grid-cols-1 gap-8">
                <Card>
                    <CardContent className="p-6 bg-blue-100 rounded-lg shadow-inner">
                        <div className="flex flex-col justify-center gap-4">
                            <div className="flex items-center gap-2">
                                <Info className="w-5 h-5 text-blue-600" />
                                <h3 className="font-medium text-blue-800">
                                    Como funciona?
                                </h3>
                            </div>

                            <ul className="list-disc list-inside space-y-1 text-sm text-blue-700">
                                <li className=''>Criptografia Simétrica (AES): A chave AES é gerada e usada para criptografar os dados, garantindo alto desempenho no processamento.</li>
                                <li className='space-y-1 text-sm text-blue-700'>Proteção da Chave AES: A chave AES é criptografada usando a chave pública RSA, protegendo-a contra acesso não autorizado.</li>
                                <li className='space-y-1 text-sm text-blue-700'>Descriptografia Segura: O receptor usa sua chave privada RSA para descriptografar a chave AES e, com ela, decifrar os dados originalmente protegidos.</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6 bg-blue-100 rounded-lg shadow-inner">
                        <div className="flex flex-col justify-center gap-4">
                            <div className="flex items-center gap-2">
                                <Info className="w-5 h-5 text-blue-600" />
                                <h3 className="font-medium text-blue-800">
                                    Por que a chave simétrica?
                                </h3>
                            </div>

                            <ul className="list-disc list-inside space-y-1 text-sm text-blue-700">
                                <li className=''>Desempenho e Velocidade: Criptografia simétrica (como AES) é muito mais rápida que algoritmos assimétricos, tornando-a ideal para grandes volumes de dados.</li>
                                <li className='space-y-1 text-sm text-blue-700'>Eficiência Computacional: Requer menos recursos computacionais, o que é vantajoso em dispositivos com capacidade limitada.</li>
                                <li className='space-y-1 text-sm text-blue-700'>Simplicidade na Implementação: A utilização de uma única chave simplifica o processo de criptografia e descriptografia.</li>
                                <li className='space-y-1 text-sm text-blue-700'>Segurança Robusta: Quando usada com chaves fortes e bem gerenciadas, a criptografia simétrica oferece proteção eficaz contra ataques.</li>
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
