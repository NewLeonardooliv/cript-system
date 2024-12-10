import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Player } from '@lottiefiles/react-lottie-player';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileSignature, Lock, ArrowRight } from 'lucide-react';
import FileUploader from '@/components/file-uploader';

export function StepSignature({
    stepData,
    setStepData,
    setStepReady
}: { stepData: any, setStepData: (data: any) => void, setStepReady: (value: boolean) => void }) {
    const [isSigningFile, setIsSigningFile] = useState(false);
    const [isEncryptingFile, setIsEncryptingFile] = useState(false);
    const [signedData, setSignedData] = useState<string | null>(null);
    const [encryptedData, setEncryptedData] = useState<string | null>(null);
    const signAnimationRef = useRef<Player>(null);
    const encryptAnimationRef = useRef<Player>(null);
    const [signActionText, setSignActionText] = useState<string>('Assinar Arquivo');
    const [encryptActionText, setEncryptActionText] = useState<string>('Cifrar Arquivo');
    const [privateKey, setPrivateKey] = useState<File | null>(null);
    const [aesKey, setAesKey] = useState<File | null>(null);



    const signFile = async () => {
        setIsSigningFile(true);
        setSignActionText("Assinando...");
        signAnimationRef.current?.play();

        await new Promise((resolve) => setTimeout(resolve, 2000));

        const simulatedSignature = btoa('Arquivo Assinado Digitalmente');
        setSignedData(simulatedSignature);
        setStepData({ ...stepData, signature: simulatedSignature });

        setSignActionText("Arquivo assinado");
        setIsSigningFile(false);
    };

    const encryptFile = async () => {
        setIsEncryptingFile(true);
        setEncryptActionText('Cifrando...');
        encryptAnimationRef.current?.play();

        await new Promise((resolve) => setTimeout(resolve, 2000));

        const simulatedEncryption = btoa('Arquivo Cifrado com AES');
        setEncryptedData(simulatedEncryption);
        setStepData({ ...stepData, encryptedData: simulatedEncryption });

        setIsEncryptingFile(false);
        setEncryptActionText('Arquivo cifrado');
    };

    const handleFileSelect = async (file: File, type: 'rsa' | 'aes') => {
        if (!file) return;

        if (type === 'rsa') {
            setPrivateKey(file);
        } else {
            setAesKey(file);
        }
    };

    useEffect(() => {
        if (signedData && encryptedData) {
            setStepReady(true);
        } else {
            setStepReady(false);
        }
    }, [signedData, encryptedData]);

    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
            >
                <h2 className="text-2xl font-bold mb-4">
                    Assinatura e Cifragem
                </h2>
                <p className="text-gray-600 mb-8">
                    Assine digitalmente o arquivo e cifre-o para transmissão
                    segura
                </p>
            </motion.div>

            <div className="flex gap-6">
                <Card className='w-full relative'>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <FileSignature className="w-5 h-5 text-blue-600" />
                            <h3 className="font-semibold">
                                Assinatura Digital
                            </h3>
                        </div>

                        <div className="absolute right-1 top-1">
                            <Player
                                ref={signAnimationRef}
                                src="https://lottie.host/580721b1-8cd6-445a-ab26-3b459c6e1ab1/KTkXURlQ5A.json"
                                style={{
                                    height: '60px',
                                    width: '60px',
                                }}
                                keepLastFrame={true}
                                loop={false}
                            />
                        </div>

                        <FileUploader
                            label='Importe a chave privada (RSA) do professor'
                            filesTypeAccepted={['pem', 'key', 'pub']}
                            className='rounded-none rounded-t-lg border-b-0'
                            handleFileSelect={(file) => handleFileSelect(file, 'rsa')} />

                        <Button
                            className="w-full rounded-none rounded-b-lg"
                            onClick={signFile}
                            disabled={isSigningFile || signedData !== null || !privateKey}
                        >
                            <FileSignature className="w-4 h-4" />
                            {signActionText}
                        </Button>
                    </CardContent>
                </Card>

                <Card className='w-full relative'>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <Lock className="w-5 h-5 text-green-600" />
                            <h3 className="font-semibold">
                                Cifragem do Arquivo
                            </h3>
                        </div>

                        <div className="absolute right-2 top-2">
                            <Player
                                ref={encryptAnimationRef}
                                src="https://lottie.host/14aa0053-d46a-46cf-a87e-4cb5b74f8cea/B0O6PtxSwi.json"
                                style={{
                                    height: '50px',
                                    width: '50px',
                                }}
                                keepLastFrame={true}
                                loop={false}
                            />
                        </div>


                        <FileUploader
                            label='Importe a chave AES'
                            className='rounded-none rounded-t-lg border-b-0'
                            handleFileSelect={(file) => handleFileSelect(file, 'aes')} />

                        <Button
                            className="w-full rounded-none rounded-b-lg"
                            onClick={encryptFile}
                            disabled={
                                isEncryptingFile ||
                                !signedData ||
                                encryptedData !== null ||
                                !privateKey &&
                                !aesKey
                            }
                        >
                            <Lock className="w-4 h-4" />
                            {encryptActionText}
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardContent className="p-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Por que este passo é importante?
                            </h3>

                            <div className="space-y-6">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <h4 className="font-medium text-blue-800 flex items-center gap-2 mb-2">
                                        <FileSignature className="w-5 h-5" />
                                        Assinatura Digital
                                    </h4>
                                    <ul className="text-sm text-blue-700 space-y-2">
                                        <li className="flex items-start gap-2">
                                            <span className="font-semibold min-w-24">
                                                Autenticidade:
                                            </span>
                                            <span>
                                                Comprova que você é o
                                                verdadeiro autor do
                                                documento
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="font-semibold min-w-24">
                                                Integridade:
                                            </span>
                                            <span>
                                                Permite detectar qualquer
                                                alteração no documento após
                                                a assinatura
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="font-semibold min-w-24">
                                                Não-repúdio:
                                            </span>
                                            <span>
                                                Impede que você negue
                                                posteriormente ter assinado
                                                o documento
                                            </span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="bg-green-50 p-4 rounded-lg">
                                    <h4 className="font-medium text-green-800 flex items-center gap-2 mb-2">
                                        <Lock className="w-5 h-5" />
                                        Cifragem
                                    </h4>
                                    <ul className="text-sm text-green-700 space-y-2">
                                        <li className="flex items-start gap-2">
                                            <span className="font-semibold min-w-24">
                                                Confidencialidade:
                                            </span>
                                            <span>
                                                Garante que apenas o
                                                destinatário autorizado
                                                possa ler o conteúdo
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="font-semibold min-w-24">
                                                Privacidade:
                                            </span>
                                            <span>
                                                Protege o documento durante
                                                toda a transmissão,
                                                mantendo-o ilegível para
                                                terceiros
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </CardContent>
            </Card>
        </div>
    );
};
