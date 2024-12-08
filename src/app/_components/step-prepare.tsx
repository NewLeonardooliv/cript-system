'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Info } from 'lucide-react';
import { Player } from '@lottiefiles/react-lottie-player';

interface FileInfo {
    name: string;
    size: number;
    hash: string;
    content?: string;
}

export function StepPreparation() {
    const [publicKey, setPublicKey] = useState<File | null>(null);
    const [, setSelectedFile] = useState<File | null>(null);
    const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const calculateSHA256 = async (file: File): Promise<string> => {
        const buffer = await file.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray
            .map((b) => b.toString(16).padStart(2, '0'))
            .join('');
        return hashHex;
    };

    const handleFileSelect = async (
        event: React.ChangeEvent<HTMLInputElement>,
        type: 'key' | 'document'
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsProcessing(true);

        try {
            if (type === 'key') {
                setPublicKey(file);
            } else {
                setSelectedFile(file);
                const hash = await calculateSHA256(file);

                let content: string | undefined;
                if (file.type === 'text/plain') {
                    content = await file.text();
                }

                setFileInfo({
                    name: file.name,
                    size: file.size,
                    hash,
                    content,
                });
            }
        } catch (error) {
            console.error('Error processing file:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    };

    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
            >
                <h2 className="text-2xl font-bold mb-4">
                    Preparação do Ambiente
                </h2>
                <p className="text-gray-600 mb-8">
                    Importe a chave pública e selecione o arquivo para envio
                </p>
            </motion.div>

            <div className="space-y-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card>
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                <label className="block">
                                    <span className="text-sm font-medium text-gray-700">
                                        Importar Chave Pública do Professor:
                                    </span>
                                    <div className="mt-1 flex items-center gap-4">
                                        <Input
                                            type="file"
                                            accept=".pem,.key,.pub"
                                            onChange={(e) =>
                                                handleFileSelect(e, 'key')
                                            }
                                        />
                                        {publicKey && (
                                            <span className="text-sm text-green-600">
                                                ✓ {publicKey.name}
                                            </span>
                                        )}
                                    </div>
                                </label>

                                <label className="block">
                                    <span className="text-sm font-medium text-gray-700">
                                        Selecionar Arquivo para Envio:
                                    </span>
                                    <div className="mt-1 flex items-center gap-4">
                                        <Input
                                            type="file"
                                            onChange={(e) =>
                                                handleFileSelect(e, 'document')
                                            }
                                        />
                                    </div>
                                </label>

                                {isProcessing && (
                                    <div className="flex justify-center">
                                        <Player
                                            autoplay
                                            loop
                                            src="https://assets9.lottiefiles.com/packages/lf20_b88nz42q.json"
                                            style={{
                                                height: '120px',
                                                width: '120px',
                                            }}
                                        />
                                    </div>
                                )}

                                {fileInfo && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="bg-gray-50 rounded-lg p-4 space-y-2"
                                    >
                                        <h3 className="font-semibold flex items-center gap-2">
                                            <Info className="w-4 h-4" />
                                            Informações do Arquivo:
                                        </h3>
                                        <div className="space-y-1 text-sm">
                                            <p>
                                                <span className="font-medium">
                                                    Nome:
                                                </span>{' '}
                                                {fileInfo.name}
                                            </p>
                                            <p>
                                                <span className="font-medium">
                                                    Tamanho:
                                                </span>{' '}
                                                {formatFileSize(fileInfo.size)}
                                            </p>
                                            <p className="break-all">
                                                <span className="font-medium">
                                                    Hash SHA-256:
                                                </span>{' '}
                                                {fileInfo.hash}
                                            </p>
                                        </div>

                                        {fileInfo.content && (
                                            <div className="mt-4">
                                                <h4 className="font-semibold mb-2 flex items-center gap-2">
                                                    <FileText className="w-4 h-4" />
                                                    Conteúdo do Arquivo:
                                                </h4>
                                                <pre className="bg-white p-4 rounded border text-sm overflow-x-auto">
                                                    {fileInfo.content}
                                                </pre>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
