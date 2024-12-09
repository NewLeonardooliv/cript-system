'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Info, Key } from 'lucide-react';
import { Player } from '@lottiefiles/react-lottie-player';

interface FileInfo {
    name: string;
    size: number;
    hash: string;
    content?: string;
}

export function StepPreparation({
    setStepData,
}: {
    setStepData: React.Dispatch<
        React.SetStateAction<{
            file: File | null;
            publicKey: File | null;
        }>
    >;
}) {
    const [publicKey, setPublicKey] = useState<File | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [publicKeyIsValid, setPublicKeyIsValid] = useState<boolean | null>(
        null
    );

    const handleFileSelect = async (
        event: React.ChangeEvent<HTMLInputElement>,
        type: 'key' | 'document'
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (type === 'key') {
            setPublicKey(file);
        } else {
            setSelectedFile(file);
        }
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    };

    async function validateData(formData: FormData) {
        const response = await fetch('/api/prepare', {
            method: 'POST',
            body: formData,
        });

        setIsProcessing(false);
        if (!response.ok) {
            setPublicKeyIsValid(false);
            return;
        }

        const data = (await response.json()) as {
            publicKey: string;
            file: {
                name: string;
                type: string;
                size: number;
                content: string;
            };
            hash: string;
        };
        setPublicKeyIsValid(true);
        setFileInfo({
            hash: data.hash,
            ...data.file,
        });
        setStepData({ file: selectedFile, publicKey: publicKey });
    }

    useEffect(() => {
        if (selectedFile && publicKey) {
            setIsProcessing(true);
            const formData = new FormData();

            formData.append('publicKey', publicKey);
            formData.append('file', selectedFile);

            validateData(formData);
        }
    }, [selectedFile, publicKey]);

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
                    Importe a chave pública e selecione o arquivo para envio seguro
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
                                        {publicKey &&
                                            typeof publicKeyIsValid ===
                                            'boolean' && (
                                                <>
                                                    {publicKeyIsValid ? (
                                                        <span className="text-sm text-green-600">
                                                            ✓ {publicKey.name}
                                                        </span>
                                                    ) : (
                                                        <span className="text-sm text-red-600">
                                                            ✓ {publicKey.name}
                                                        </span>
                                                    )}
                                                </>
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

            <div className="mt-8 p-6 bg-gray-50 rounded-lg border">
                <h3 className="text-lg font-semibold mb-4">Como funciona o processo de envio seguro?</h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white p-4 rounded-lg border">
                        <div className="flex items-center gap-2 mb-3">
                            <Key className="w-5 h-5 text-blue-600" />
                            <h4 className="font-medium">Chave Pública</h4>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                            <p>✓ Importada do professor</p>
                            <p>✓ Garante envio seguro</p>
                            <p>✓ Validação automática</p>
                            <p>✗ Não pode ser usada para descriptografar</p>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border">
                        <div className="flex items-center gap-2 mb-3">
                            <FileText className="w-5 h-5 text-green-600" />
                            <h4 className="font-medium">Arquivo</h4>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                            <p>✓ Visualização prévia</p>
                            <p>✓ Verificação de integridade</p>
                            <p>✓ Hash SHA-256</p>
                            <p>✓ Tamanho do arquivo</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-4 bg-white rounded-lg border border-blue-100">
                <h4 className="text-sm font-medium text-blue-700 mb-2">Informações Importantes</h4>
                <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
                    <li>A chave pública do professor é necessária para garantir o envio seguro</li>
                    <li>O hash do arquivo serve como prova de integridade</li>
                    <li>Arquivos de texto podem ser visualizados antes do envio</li>
                    <li>O sistema suporta diversos formatos de arquivo</li>
                </ul>
            </div>

            <div className="p-4 bg-white rounded-lg border border-amber-100">
                <h4 className="text-sm font-medium text-amber-700 mb-2">Dicas de Segurança</h4>
                <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
                    <li>Certifique-se de usar a chave pública correta do professor</li>
                    <li>Verifique o conteúdo do arquivo antes do envio</li>
                    <li>Guarde o hash do arquivo para verificação posterior</li>
                    <li>Em caso de erro, você pode reiniciar o processo a qualquer momento</li>
                </ul>
            </div>
        </div>
    );
}
