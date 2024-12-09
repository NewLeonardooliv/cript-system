'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Player } from '@lottiefiles/react-lottie-player';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Lock, Key, Shield, Eye, EyeOff, CircleHelp } from 'lucide-react';

export function StepGenerateKeys() {
    const [rsaKeys, setRsaKeys] = useState<{
        publicKey: string;
        privateKey: string;
    } | null>(null);
    const [aesKey, setAesKey] = useState<string | null>(null);
    const [isGeneratingRSA, setIsGeneratingRSA] = useState(false);
    const [isGeneratingAES, setIsGeneratingAES] = useState(false);
    const [showPrivateKey, setShowPrivateKey] = useState(false);
    const [showAesKey, setShowAesKey] = useState(false);
    const rsaAnimationRef = useRef<Player>(null);
    const aesAnimationRef = useRef<Player>(null);

    const maskKey = (key: string) => {
        const visibleStart = key.slice(0, 20);
        const visibleEnd = key.slice(-20);
        return `${visibleStart}...${visibleEnd}`;
    };

    const generateRSAKeys = async () => {
        setIsGeneratingRSA(true);
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
        } catch (error) {
            console.error('Erro ao gerar chaves RSA:', error);
        }

        setIsGeneratingRSA(false);
        rsaAnimationRef.current?.stop();
    };

    const generateAESKey = async () => {
        setIsGeneratingAES(true);
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
        setShowPrivateKey(false);
        setShowAesKey(false);
        rsaAnimationRef.current?.stop();
        aesAnimationRef.current?.stop();
    };

    const resetRSA = () => {
        setRsaKeys(null);
        setIsGeneratingRSA(false);
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
        try {
            const response = await fetch('/api/generate-keys/rsa/download', {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error('Falha ao baixar chaves RSA');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'rsa_keys.zip';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Erro ao baixar chaves RSA:', error);
        }
    };

    const downloadAESKey = async () => {
        try {
            const response = await fetch('/api/generate-keys/aes/download', {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error('Falha ao baixar chave AES');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'aes_key.txt';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Erro ao baixar chave AES:', error);
        }
    };

    return (
        <div className="space-y-10 w-full">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
            >
                <h2 className="text-2xl font-bold mb-4">Geração de Chaves</h2>
                <p className="text-gray-600 mb-8">
                    Gere as chaves necessárias para a comunicação segura
                </p>
            </motion.div>

            <div className="flex justify-end space-x-2">
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
                        <Button
                            className="w-full"
                            onClick={generateRSAKeys}
                            disabled={isGeneratingRSA}
                        >
                            <Lock className="w-4 h-4 mr-2" />
                            <span>
                                {isGeneratingRSA
                                    ? 'Gerando...'
                                    : 'Gerar Par de Chaves RSA'}
                            </span>
                        </Button>
                        {rsaKeys && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={resetRSA}
                                className="mt-2 text-red-600 hover:bg-red-50 w-full"
                            >
                                Reiniciar RSA
                            </Button>
                        )}
                        {rsaKeys && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mt-4 space-y-2"
                            >
                                <div className="text-sm bg-white p-3 rounded border">
                                    <div className="font-medium text-gray-700 mb-1 flex items-center justify-between">
                                        <span>Chave Pública:</span>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 px-2"
                                                        onClick={() =>
                                                            navigator.clipboard.writeText(
                                                                rsaKeys.publicKey
                                                            )
                                                        }
                                                    >
                                                        Copiar
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Copiar chave pública</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                    <div className="text-xs text-gray-600 break-all font-mono">
                                        {maskKey(rsaKeys.publicKey)}
                                    </div>
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
                                                            onClick={() =>
                                                                navigator.clipboard.writeText(
                                                                    rsaKeys.privateKey
                                                                )
                                                            }
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
                                        <p className="text-xs text-amber-600 mt-2">
                                            ⚠️ A chave privada está oculta por
                                            segurança. Clique no ícone do olho
                                            para visualizar.
                                        </p>
                                    )}
                                </div>
                                <div className="flex justify-end gap-2 mt-4">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={downloadRSAKeys}
                                                    className="h-8 px-3"
                                                >
                                                    Baixar Chaves
                                                </Button>
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

                        <Button
                            className="w-full"
                            onClick={generateAESKey}
                            disabled={isGeneratingAES}
                        >
                            <Key className="w-4 h-4 mr-2" />
                            <span>
                                {isGeneratingAES
                                    ? 'Gerando...'
                                    : 'Gerar Chave Simétrica AES'}
                            </span>
                        </Button>

                        {aesKey && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={resetAES}
                                className="mt-2 text-red-600 hover:bg-red-50 w-full"
                            >
                                Reiniciar AES
                            </Button>
                        )}

                        {aesKey && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mt-4"
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
                                                            onClick={() =>
                                                                navigator.clipboard.writeText(
                                                                    aesKey
                                                                )
                                                            }
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
                                        {showAesKey ? aesKey : maskKey(aesKey)}
                                    </div>
                                    {!showAesKey && (
                                        <p className="text-xs text-amber-600 mt-2">
                                            ⚠️ A chave está parcialmente oculta
                                            por segurança. Clique no ícone do
                                            olho para visualizar completamente.
                                        </p>
                                    )}
                                </div>
                                <div className="mt-2 text-xs text-gray-500">
                                    <p>
                                        Esta chave AES-256 pode ser usada para
                                        criptografar grandes volumes de dados de
                                        forma eficiente.
                                    </p>
                                </div>
                                <div className="flex justify-end gap-2 mt-4">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={downloadAESKey}
                                                    className="h-8 px-3"
                                                >
                                                    Baixar Chave
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Baixar chave AES em arquivo texto</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </motion.div>
                        )}
                        <div className="mb-4 p-4 bg-white rounded-lg border border-green-100">
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
    );
}