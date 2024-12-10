'use client';

import JSZip from 'jszip';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Player } from '@lottiefiles/react-lottie-player';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Lock, Key, Shield, Eye, EyeOff, CircleHelp, TriangleAlert, RotateCcw, Download } from 'lucide-react';
import { toast, useToast } from '@/hooks/use-toast';

export function StepGenerateKeys({ setStepReady }: { setStepReady: (value: boolean) => void }) {
    const [rsaKeys, setRsaKeys] = useState<{
        publicKey: string;
        privateKey: string;
    } | null>(null);
    const [aesKey, setAesKey] = useState<string | null>(null);
    const [isGeneratingRSA, setIsGeneratingRSA] = useState(false);
    const [isGeneratingAES, setIsGeneratingAES] = useState(false);
    const [showPublicKey, setShowPublicKey] = useState(false);
    const [showPrivateKey, setShowPrivateKey] = useState(false);
    const [showAesKey, setShowAesKey] = useState(false);
    const rsaAnimationRef = useRef<Player>(null);
    const aesAnimationRef = useRef<Player>(null);
    const [rsaActionText, setRsaActionText] = useState<string>('Gerar par de chaves RSA')
    const [aesActionText, setAesActionText] = useState<string>('Gerar Chave Simétrica AES')
    const { toast } = useToast();

    const copyPublicKey = () => {
        if (rsaKeys) {
            navigator.clipboard.writeText(
                rsaKeys.publicKey
            )

            toast({
                className: "bg-gray-900 text-white",
                description: "Chave pública copiada com sucesso",
            })
        }
    };

    const copyPrivateKey = () => {
        if (rsaKeys) {
            navigator.clipboard.writeText(
                rsaKeys.privateKey
            )

            toast({
                className: "bg-gray-900 text-white",
                description: "Chave privada copiada com sucesso",
            })
        }
    };

    const copyAesKey = () => {
        if (aesKey) {
            navigator.clipboard.writeText(
                aesKey
            )

            toast({
                className: "bg-gray-900 text-white",
                description: "Chave AES copiada com sucesso",
            })
        }
    };

    // const maskKey = (key: string) => {
    //     const visibleStart = key.slice(0, 20);
    //     const visibleEnd = key.slice(-20);
    //     return `${visibleStart}...${visibleEnd}`;
    // };

    const generateRSAKeys = async () => {
        setIsGeneratingRSA(true);
        setRsaActionText("Gerando...")
        rsaAnimationRef.current?.play();

        try {
            const response = await fetch('/api/generate-keys/rsa', {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error('Falha ao gerar chaves RSA');
            }

            const { publicKey, privateKey } = await response.json();

            setRsaKeys({
                publicKey,
                privateKey,
            });

            setRsaActionText("Chaves RSA geradas")
        } catch (error) {
            console.error('Erro ao gerar chaves RSA:', error);
        }

        setIsGeneratingRSA(false);
        rsaAnimationRef.current?.stop();
    };

    const generateAESKey = async () => {
        setIsGeneratingAES(true);
        setAesActionText('Gerando...')
        aesAnimationRef.current?.play();

        try {
            const response = await fetch('/api/generate-keys/aes', {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error('Falha ao gerar chave AES');
            }

            const { key } = await response.json();
            setAesKey(key);

            setAesActionText('Chave AES gerada')
        } catch (error) {
            console.error('Erro ao gerar chave AES:', error);
        }

        setIsGeneratingAES(false);
        aesAnimationRef.current?.stop();
    };

    const resetAll = () => {
        setRsaKeys(null);
        setAesKey(null);
        setIsGeneratingRSA(false);
        setIsGeneratingAES(false);
        setShowPublicKey(false);
        setShowPrivateKey(false);
        setShowAesKey(false);
        rsaAnimationRef.current?.stop();
        aesAnimationRef.current?.stop();
    };

    const resetRSA = () => {
        setRsaKeys(null);
        setIsGeneratingRSA(false);
        setShowPublicKey(false);
        setShowPrivateKey(false);
        rsaAnimationRef.current?.stop();
    };

    const resetAES = () => {
        setAesKey(null);
        setIsGeneratingAES(false);
        setShowAesKey(false);
        aesAnimationRef.current?.stop();
    };

    const downloadRSAKeys = async () => {
        if (!rsaKeys) return;

        const zip = new JSZip();

        zip.file('public_key.pem', rsaKeys.publicKey);
        zip.file('private_key.pem', rsaKeys.privateKey);

        const content = await zip.generateAsync({ type: 'blob' });

        const url = window.URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'rsa_keys.zip';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    };

    const downloadAESKey = async () => {
        if (!aesKey) {
            toast({
                description: "Erro ao baixar a chave AES",
                variant: "destructive"
            });

            return;
        }

        const blob = new Blob([aesKey], { type: "text/plain" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'aes_key.txt';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    };

    useEffect(() => {
        if (rsaKeys && aesKey) {
            setStepReady(true);
        } else {
            setStepReady(false);
        }
    }, [rsaKeys, aesKey]);

    return (
        <div className="w-full">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
            >
                <h2 className="text-2xl font-bold mb-4">Geração de Chaves</h2>
                <p className="text-gray-600">
                    Gere as chaves necessárias para a comunicação segura
                </p>
            </motion.div>

            <div className="space-y-6">
                <div className="flex justify-end">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={resetAll}
                                    className="text-red-600 border-red-200 hover:bg-red-50"
                                >
                                    Reiniciar Tudo
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Limpar todas as chaves geradas</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>

                <div className="space-y-6 xl:flex xl:space-x-6 xl:space-y-0 w-full">
                    <TooltipProvider>
                        <motion.div className="p-6 border rounded-lg bg-gray-50 w-full">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-blue-600" />
                                    <h3 className="font-semibold">Chaves RSA</h3>
                                </div>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="cursor-help">
                                            <CircleHelp />
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-sm">
                                        <p>
                                            RSA é um algoritmo de criptografia
                                            assimétrica que usa um par de chaves:
                                            pública para criptografar e privada para
                                            descriptografar.
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                            <Button
                                className="w-full mb-4"
                                onClick={generateRSAKeys}
                                disabled={rsaKeys !== null}
                            >
                                <Lock className="w-4 h-4 mr-2" />
                                {rsaActionText}
                            </Button>

                            <div className="flex items-center justify-center mb-4">
                                <Player
                                    ref={rsaAnimationRef}
                                    src="https://lottie.host/640cc0b4-188a-4b90-90ec-e169f6ce4341/frYqKpBWsc.json"
                                    style={{
                                        height: '150px',
                                        width: '150px',
                                        display: isGeneratingRSA ? 'block' : 'none',
                                    }}
                                />
                            </div>

                            {rsaKeys && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="space-y-2 mb-2"
                                >
                                    <div className="text-sm bg-white p-3 rounded border">
                                        <div className="font-medium text-gray-700 mb-1 flex items-center justify-between">
                                            <span>Chave Pública:</span>
                                            <div className="flex gap-2">
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-6 px-2"
                                                                onClick={() =>
                                                                    setShowPublicKey(
                                                                        !showPublicKey
                                                                    )
                                                                }
                                                            >
                                                                {showPublicKey ? (
                                                                    <EyeOff className="h-4 w-4" />
                                                                ) : (
                                                                    <Eye className="h-4 w-4" />
                                                                )}
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>
                                                                {showPublicKey
                                                                    ? 'Ocultar'
                                                                    : 'Mostrar'}{' '}
                                                                chave pública
                                                            </p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-6 px-2"
                                                                onClick={copyPublicKey}
                                                            >
                                                                Copiar
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>
                                                                Copiar chave pública
                                                            </p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                        </div>
                                        <div className="text-xs text-gray-600 break-all font-mono">
                                            {showPublicKey
                                                ? rsaKeys.publicKey
                                                : '••••••••••••••••••••••••••'}
                                        </div>
                                        {!showPublicKey && (
                                            <div className="flex items-center gap-1 mt-2">
                                                <TriangleAlert className='text-yellow-500 w-4 h-4' />
                                                <p className="text-xs text-amber-600">
                                                    A chave pública está oculta por
                                                    segurança. Clique no ícone do olho
                                                    para visualizar.
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="text-sm bg-white p-3 rounded border">
                                        <div className="font-medium text-gray-700 mb-1 flex items-center justify-between">
                                            <span>Chave Privada:</span>
                                            <div className="flex gap-2">
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-6 px-2"
                                                                onClick={() =>
                                                                    setShowPrivateKey(
                                                                        !showPrivateKey
                                                                    )
                                                                }
                                                            >
                                                                {showPrivateKey ? (
                                                                    <EyeOff className="h-4 w-4" />
                                                                ) : (
                                                                    <Eye className="h-4 w-4" />
                                                                )}
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>
                                                                {showPrivateKey
                                                                    ? 'Ocultar'
                                                                    : 'Mostrar'}{' '}
                                                                chave privada
                                                            </p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-6 px-2"
                                                                onClick={copyPrivateKey}

                                                            >
                                                                Copiar
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>
                                                                Copiar chave privada
                                                            </p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                        </div>
                                        <div className="text-xs text-gray-600 break-all font-mono">
                                            {showPrivateKey
                                                ? rsaKeys.privateKey
                                                : '••••••••••••••••••••••••••'}
                                        </div>
                                        {!showPrivateKey && (
                                            <div className="flex items-center gap-1 mt-2">
                                                <TriangleAlert className='text-yellow-500 w-4 h-4' />
                                                <p className="text-xs text-amber-600">
                                                    A chave privada está oculta por
                                                    segurança. Clique no ícone do olho
                                                    para visualizar.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <div className='flex items-center gap-2'>
                                                        {rsaKeys && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={resetRSA}
                                                                className="h-8 px-3 text-red-600"
                                                            >
                                                                <RotateCcw className='text-red-600 w-4 h-4' />
                                                                Reiniciar RSA
                                                            </Button>
                                                        )}

                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={downloadRSAKeys}
                                                            className="h-8 px-3"
                                                        >
                                                            <Download className='w-4 h-4' />
                                                            Baixar Chaves
                                                        </Button>
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Baixar chaves RSA em arquivo ZIP</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </motion.div>
                            )}
                            <div className="mb-4 p-4 bg-white rounded-lg border border-blue-100">
                                <h4 className="text-sm font-medium text-blue-700 mb-2">Como funciona o RSA?</h4>
                                <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
                                    <li>Usa duas chaves diferentes: uma pública e uma privada</li>
                                    <li>A chave pública pode ser compartilhada livremente</li>
                                    <li>Apenas a chave privada pode descriptografar as mensagens</li>
                                    <li>Ideal para troca segura de chaves e assinaturas digitais</li>
                                </ul>
                            </div>
                        </motion.div>

                        <motion.div className="p-6 border rounded-lg bg-gray-50 w-full">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-2">
                                    <Key className="w-5 h-5 text-green-600" />
                                    <h3 className="font-semibold">Chave AES</h3>
                                </div>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="cursor-help">
                                            <CircleHelp />
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-sm">
                                        <p>
                                            AES-GCM é um algoritmo de criptografia
                                            simétrica que usa a mesma chave para
                                            criptografar e descriptografar dados.
                                            Esta implementação usa uma chave de 256
                                            bits para máxima segurança.
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            </div>

                            <Button
                                className="w-full mb-4"
                                onClick={generateAESKey}
                                disabled={aesKey !== null}
                            >
                                <Key className="w-4 h-4 mr-2" />
                                {aesActionText}
                            </Button>

                            <div className="flex items-center justify-center mb-4">
                                <Player
                                    ref={aesAnimationRef}
                                    src="https://lottie.host/640cc0b4-188a-4b90-90ec-e169f6ce4341/frYqKpBWsc.json"
                                    style={{
                                        height: '150px',
                                        width: '150px',
                                        display: isGeneratingAES ? 'block' : 'none',
                                    }}
                                />
                            </div>

                            {aesKey && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="space-y-2 mb-2"
                                >
                                    <div className="text-sm bg-white p-3 rounded border">
                                        <div className="font-medium text-gray-700 mb-1 flex items-center justify-between">
                                            <span>Chave AES:</span>
                                            <div className="flex gap-2">
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-6 px-2"
                                                                onClick={() =>
                                                                    setShowAesKey(
                                                                        !showAesKey
                                                                    )
                                                                }
                                                            >
                                                                {showAesKey ? (
                                                                    <EyeOff className="h-4 w-4" />
                                                                ) : (
                                                                    <Eye className="h-4 w-4" />
                                                                )}
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>
                                                                {showAesKey
                                                                    ? 'Ocultar'
                                                                    : 'Mostrar'}{' '}
                                                                chave AES
                                                            </p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-6 px-2"
                                                                onClick={copyAesKey}
                                                            >
                                                                Copiar
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Copiar chave AES</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                        </div>
                                        <div className="text-xs text-gray-600 break-all font-mono">
                                            {showAesKey ? aesKey : '••••••••••••••••••••••••••'}
                                        </div>
                                        {!showAesKey && (
                                            <p className="text-xs text-amber-600 mt-2">
                                                ⚠️ A chave está parcialmente oculta
                                                por segurança. Clique no ícone do
                                                olho para visualizar completamente.
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <div className='flex items-center gap-2'>
                                                        {aesKey && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={resetAES}
                                                                className="h-8 px-3 text-red-600"
                                                            >
                                                                <RotateCcw className='text-red-600 w-4 h-4' />
                                                                Reiniciar AES
                                                            </Button>
                                                        )}

                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={downloadAESKey}
                                                            className="h-8 px-3"
                                                        >
                                                            <Download className='w-4 h-4' />
                                                            Baixar Chave
                                                        </Button>
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Baixar chaves RSA em arquivo ZIP</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </motion.div>
                            )}
                            <div className="mb-4 p-4 bg-white rounded-lg border border-green-200">
                                <h4 className="text-sm font-medium text-green-700 mb-2">Como funciona o AES?</h4>
                                <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
                                    <li>Usa uma única chave para criptografar e descriptografar</li>
                                    <li>Mais rápido que RSA para grandes volumes de dados</li>
                                    <li>A mesma chave deve ser compartilhada de forma segura</li>
                                    <li>Amplamente usado para criptografia de dados em massa</li>
                                </ul>
                            </div>
                        </motion.div>
                    </TooltipProvider>
                </div>

                <div className="mt-8 p-6 bg-gray-50 rounded-lg border">
                    <h3 className="text-lg font-semibold mb-4">Comparação: RSA vs AES</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white p-4 rounded-lg border">
                            <div className="flex items-center gap-2 mb-3">
                                <Shield className="w-5 h-5 text-blue-600" />
                                <h4 className="font-medium">RSA (Assimétrica)</h4>
                            </div>
                            <div className="space-y-2 text-sm text-gray-600">
                                <p>✓ Mais seguro para troca de chaves</p>
                                <p>✓ Permite assinatura digital</p>
                                <p>✗ Mais lento para grandes volumes</p>
                                <p>✗ Chaves maiores</p>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border">
                            <div className="flex items-center gap-2 mb-3">
                                <Key className="w-5 h-5 text-green-600" />
                                <h4 className="font-medium">AES (Simétrica)</h4>
                            </div>
                            <div className="space-y-2 text-sm text-gray-600">
                                <p>✓ Mais rápido</p>
                                <p>✓ Ideal para grandes volumes</p>
                                <p>✗ Precisa compartilhar a chave</p>
                                <p>✗ Sem suporte a assinatura digital</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}