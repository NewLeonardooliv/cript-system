'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Player } from '@lottiefiles/react-lottie-player'
import { Button } from '@/components/ui/button'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { Lock, Key, Shield, Eye, EyeOff } from 'lucide-react'

export function StepGenerateKeys() {
    const [rsaKeys, setRsaKeys] = useState<{ publicKey: string; privateKey: string } | null>(null)
    const [aesKey, setAesKey] = useState<string | null>(null)
    const [isGeneratingRSA, setIsGeneratingRSA] = useState(false)
    const [isGeneratingAES, setIsGeneratingAES] = useState(false)
    const [showPrivateKey, setShowPrivateKey] = useState(false)
    const [showAesKey, setShowAesKey] = useState(false)
    const rsaAnimationRef = useRef<Player>(null)
    const aesAnimationRef = useRef<Player>(null)

    const maskKey = (key: string) => {
        const visibleStart = key.slice(0, 20)
        const visibleEnd = key.slice(-20)
        return `${visibleStart}...${visibleEnd}`
    }

    const generateRSAKeys = async () => {
        setIsGeneratingRSA(true)
        rsaAnimationRef.current?.play()

        try {
            const keyPair = await window.crypto.subtle.generateKey(
                {
                    name: "RSA-OAEP",
                    modulusLength: 2048,
                    publicExponent: new Uint8Array([1, 0, 1]),
                    hash: "SHA-256",
                },
                true,
                ["encrypt", "decrypt"]
            );

            const publicKeyBuffer = await window.crypto.subtle.exportKey(
                "spki",
                keyPair.publicKey
            );
            const publicKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(publicKeyBuffer)));

            const privateKeyBuffer = await window.crypto.subtle.exportKey(
                "pkcs8",
                keyPair.privateKey
            );
            const privateKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(privateKeyBuffer)));

            setRsaKeys({
                publicKey: publicKeyBase64,
                privateKey: privateKeyBase64,
            });
        } catch (error) {
            console.error('Erro ao gerar chaves RSA:', error);
        }

        setIsGeneratingRSA(false)
        rsaAnimationRef.current?.stop()
    }

    const generateAESKey = async () => {
        setIsGeneratingAES(true)
        aesAnimationRef.current?.play()

        try {
            const key = await window.crypto.subtle.generateKey(
                {
                    name: "AES-GCM",
                    length: 256,
                },
                true,
                ["encrypt", "decrypt"]
            );

            const keyBuffer = await window.crypto.subtle.exportKey("raw", key);
            const keyBase64 = btoa(String.fromCharCode(...new Uint8Array(keyBuffer)));

            setAesKey(keyBase64);
        } catch (error) {
            console.error('Erro ao gerar chave AES:', error);
        }

        setIsGeneratingAES(false)
        aesAnimationRef.current?.stop()
    }

    return (
        <div className="space-y-8">
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

            <div className="space-y-6">
                <TooltipProvider>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="p-6 border rounded-lg bg-gray-50"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2">
                                <Shield className="w-5 h-5 text-blue-600" />
                                <h3 className="font-semibold">Chaves RSA</h3>
                            </div>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="cursor-help">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-xs"
                                        >
                                            Saiba mais
                                        </Button>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-sm">
                                    <p>
                                        RSA é um algoritmo de criptografia assimétrica que usa um par de chaves:
                                        pública para criptografar e privada para descriptografar.
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                        <div className="flex items-center justify-center mb-4">
                            <Player
                                ref={rsaAnimationRef}
                                src="https://lottie.host/640cc0b4-188a-4b90-90ec-e169f6ce4341/frYqKpBWsc.json"
                                style={{ height: '150px', width: '150px', display: isGeneratingRSA ? 'block' : 'none' }}
                            />
                        </div>
                        <Button
                            className="w-full"
                            onClick={generateRSAKeys}
                            disabled={isGeneratingRSA}
                        >
                            <Lock className="w-4 h-4 mr-2" />
                            <span>{isGeneratingRSA ? 'Gerando...' : 'Gerar Par de Chaves RSA'}</span>
                        </Button>
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
                                                        onClick={() => navigator.clipboard.writeText(rsaKeys.publicKey)}
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
                                                            onClick={() => setShowPrivateKey(!showPrivateKey)}
                                                        >
                                                            {showPrivateKey ? (
                                                                <EyeOff className="h-4 w-4" />
                                                            ) : (
                                                                <Eye className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>{showPrivateKey ? 'Ocultar' : 'Mostrar'} chave privada</p>
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
                                                            onClick={() => navigator.clipboard.writeText(rsaKeys.privateKey)}
                                                        >
                                                            Copiar
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Copiar chave privada</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-600 break-all font-mono">
                                        {showPrivateKey ? rsaKeys.privateKey : '••••••••••••••••••••••••••'}
                                    </div>
                                    {!showPrivateKey && (
                                        <p className="text-xs text-amber-600 mt-2">
                                            ⚠️ A chave privada está oculta por segurança. Clique no ícone do olho para visualizar.
                                        </p>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="p-6 border rounded-lg bg-gray-50"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2">
                                <Key className="w-5 h-5 text-green-600" />
                                <h3 className="font-semibold">Chave AES</h3>
                            </div>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="cursor-help">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-xs"
                                        >
                                            Saiba mais
                                        </Button>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-sm">
                                    <p>
                                        AES-GCM é um algoritmo de criptografia simétrica que usa a mesma chave
                                        para criptografar e descriptografar dados. Esta implementação usa uma
                                        chave de 256 bits para máxima segurança.
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        </div>

                        <div className="flex items-center justify-center mb-4">
                            <Player
                                ref={aesAnimationRef}
                                src="https://lottie.host/640cc0b4-188a-4b90-90ec-e169f6ce4341/frYqKpBWsc.json"
                                style={{ height: '150px', width: '150px', display: isGeneratingAES ? 'block' : 'none' }}
                            />
                        </div>

                        <Button
                            className="w-full"
                            onClick={generateAESKey}
                            disabled={isGeneratingAES}
                        >
                            <Key className="w-4 h-4 mr-2" />
                            <span>{isGeneratingAES ? 'Gerando...' : 'Gerar Chave Simétrica AES'}</span>
                        </Button>

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
                                                            onClick={() => setShowAesKey(!showAesKey)}
                                                        >
                                                            {showAesKey ? (
                                                                <EyeOff className="h-4 w-4" />
                                                            ) : (
                                                                <Eye className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>{showAesKey ? 'Ocultar' : 'Mostrar'} chave AES</p>
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
                                                            onClick={() => navigator.clipboard.writeText(aesKey)}
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
                                            ⚠️ A chave está parcialmente oculta por segurança. Clique no ícone do olho para visualizar completamente.
                                        </p>
                                    )}
                                </div>
                                <div className="mt-2 text-xs text-gray-500">
                                    <p>Esta chave AES-256 pode ser usada para criptografar grandes volumes de dados de forma eficiente.</p>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                </TooltipProvider>
            </div>
        </div>
    )
}

