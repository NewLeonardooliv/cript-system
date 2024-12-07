import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Player } from '@lottiefiles/react-lottie-player';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileSignature, Lock, ArrowRight } from 'lucide-react';

export const StepSignature: React.FC<{ 
    stepData: any; 
    setStepData: (data: any) => void 
}> = ({ stepData, setStepData }) => {
    const [isSigningFile, setIsSigningFile] = useState(false);
    const [isEncryptingFile, setIsEncryptingFile] = useState(false);
    const [signedData, setSignedData] = useState<string | null>(null);
    const [encryptedData, setEncryptedData] = useState<string | null>(null);
    const signAnimationRef = useRef<Player>(null);
    const encryptAnimationRef = useRef<Player>(null);

    const signFile = async () => {
        setIsSigningFile(true);
        signAnimationRef.current?.play();

        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const simulatedSignature = btoa("Arquivo Assinado Digitalmente");
        setSignedData(simulatedSignature);
        setStepData({ ...stepData, signature: simulatedSignature });

        setIsSigningFile(false);
        signAnimationRef.current?.stop();
    };

    const encryptFile = async () => {
        setIsEncryptingFile(true);
        encryptAnimationRef.current?.play();

        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const simulatedEncryption = btoa("Arquivo Cifrado com AES");
        setEncryptedData(simulatedEncryption);
        setStepData({ ...stepData, encryptedData: simulatedEncryption });

        setIsEncryptingFile(false);
        encryptAnimationRef.current?.stop();
    };

    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
            >
                <h2 className="text-2xl font-bold mb-4">Assinatura e Cifragem</h2>
                <p className="text-gray-600 mb-8">
                    Assine digitalmente o arquivo e cifre-o para transmissão segura
                </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-8">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <FileSignature className="w-5 h-5 text-blue-600" />
                            <h3 className="font-semibold">Assinatura Digital</h3>
                        </div>
                        
                        <div className="flex justify-center mb-4">
                            <Player
                                ref={signAnimationRef}
                                src="https://lottie.host/640cc0b4-188a-4b90-90ec-e169f6ce4341/frYqKpBWsc.json"
                                style={{ height: '150px', width: '150px', display: isSigningFile ? 'block' : 'none' }}
                            />
                        </div>

                        <Button
                            className="w-full"
                            onClick={signFile}
                            disabled={isSigningFile || signedData !== null}
                        >
                            <FileSignature className="w-4 h-4" />
                            {isSigningFile ? 'Assinando...' : 'Assinar Arquivo'}
                        </Button>

                        {signedData && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mt-4 p-3 bg-gray-50 rounded-md"
                            >
                                <p className="text-sm text-gray-600">
                                    Arquivo assinado com sucesso! 
                                    <ArrowRight className="inline w-4 h-4 ml-2" />
                                </p>
                            </motion.div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Lock className="w-5 h-5 text-green-600" />
                            <h3 className="font-semibold">Cifragem do Arquivo</h3>
                        </div>

                        <div className="flex justify-center mb-4">
                            <Player
                                ref={encryptAnimationRef}
                                src="https://lottie.host/640cc0b4-188a-4b90-90ec-e169f6ce4341/frYqKpBWsc.json"
                                style={{ height: '150px', width: '150px', display: isEncryptingFile ? 'block' : 'none' }}
                            />
                        </div>

                        <Button
                            className="w-full"
                            onClick={encryptFile}
                            disabled={isEncryptingFile || !signedData || encryptedData !== null}
                        >
                            <Lock className="w-4 h-4" />
                            {isEncryptingFile ? 'Cifrando...' : 'Cifrar Arquivo'}
                        </Button>

                        {encryptedData && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mt-4 p-3 bg-gray-50 rounded-md"
                            >
                                <p className="text-sm text-gray-600">
                                    Arquivo cifrado com sucesso!
                                    <ArrowRight className="inline w-4 h-4 ml-2" />
                                </p>
                            </motion.div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};