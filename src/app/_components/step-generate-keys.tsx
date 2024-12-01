'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { Lock, Key, Shield } from 'lucide-react'

export function StepGenerateKeys() {
    const [rsaKeys, setRsaKeys] = useState<{ publicKey: string; privateKey: string } | null>(null)
    const [aesKey, setAesKey] = useState<string | null>(null)
    const [isGeneratingRSA, setIsGeneratingRSA] = useState(false)
    const [isGeneratingAES, setIsGeneratingAES] = useState(false)

    const generateRSAKeys = async () => {
        setIsGeneratingRSA(true)
        // Simulate key generation
        await new Promise((resolve) => setTimeout(resolve, 1500))
        setRsaKeys({
            publicKey: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A...',
            privateKey: 'MIIEvgIBADANBgkqhkiG9w0BAQEFAASCB...',
        })
        setIsGeneratingRSA(false)
    }

    const generateAESKey = async () => {
        setIsGeneratingAES(true)
        // Simulate key generation
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setAesKey('AES-256-GCM-Key-Example')
        setIsGeneratingAES(false)
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
                        <Button
                            className="w-full"
                            onClick={generateRSAKeys}
                            disabled={isGeneratingRSA}
                        >
                            {isGeneratingRSA ? (
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                >
                                    <Lock className="w-4 h-4 mr-2" />
                                </motion.div>
                            ) : (
                                <Lock className="w-4 h-4 mr-2" />
                            )}
                            <span>Gerar Par de Chaves RSA</span>
                        </Button>
                        {rsaKeys && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mt-4 space-y-2"
                            >
                                <div className="text-sm bg-white p-3 rounded border">
                                    <div className="font-medium text-gray-700 mb-1">Chave Pública:</div>
                                    <div className="text-xs text-gray-600 break-all">
                                        {rsaKeys.publicKey}
                                    </div>
                                </div>
                                <div className="text-sm bg-white p-3 rounded border">
                                    <div className="font-medium text-gray-700 mb-1">Chave Privada:</div>
                                    <div className="text-xs text-gray-600 break-all">
                                        {rsaKeys.privateKey}
                                    </div>
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
                                        AES é um algoritmo de criptografia simétrica que usa a mesma chave
                                        para criptografar e descriptografar dados.
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                        <Button
                            className="w-full"
                            onClick={generateAESKey}
                            disabled={isGeneratingAES}
                        >
                            {isGeneratingAES ? (
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                >
                                    <Key className="w-4 h-4 mr-2" />
                                </motion.div>
                            ) : (
                                <Key className="w-4 h-4 mr-2" />
                            )}
                            <span>Gerar Chave Simétrica AES</span>
                        </Button>
                        {aesKey && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mt-4"
                            >
                                <div className="text-sm bg-white p-3 rounded border">
                                    <div className="font-medium text-gray-700 mb-1">Chave AES:</div>
                                    <div className="text-xs text-gray-600 break-all">{aesKey}</div>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                </TooltipProvider>
            </div>
        </div>
    )
}

