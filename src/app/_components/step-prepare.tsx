'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Info, Key } from 'lucide-react';
import { Player } from '@lottiefiles/react-lottie-player';
import FileUploader from '@/components/file-uploader';

interface FileInfo {
    name: string;
    size: number;
    hash: string;
    content?: string;
}

export function StepPreparation({
    setStepData,
    setStepReady,
}: {
    setStepData: React.Dispatch<
        React.SetStateAction<{
            file: File | null;
            publicKey: File | null;
        }>
    >,
    setStepReady: (value: boolean) => void
}) {
    const [publicKey, setPublicKey] = useState<File | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleFileSelect = async (file: File, type: 'key' | 'document') => {
        if (!file) return;

        if (type === 'key') {
            setPublicKey(file);
        } else {
            setSelectedFile(file);
        }

        if (publicKey && selectedFile) setIsProcessing(true);
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

            setStepReady(true);
        } else {
            setStepReady(false);
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
                                <div className="flex gap-6">
                                    <FileUploader
                                        label='Importe a chave pública (RSA) do professor'
                                        filesTypeAccepted={['pem', 'key', 'pub']}
                                        handleFileSelect={(file) => handleFileSelect(file, 'key')} />

                                    <FileUploader
                                        label='Importe o arquivo que deseje enviar'
                                        handleFileSelect={(file) => handleFileSelect(file, 'document')} />
                                </div>

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

            <Card className='w-full rounded-lg shadow-none'>
                <CardContent className="p-4 bg-white border-blue-100 rounded-lg w-full">
                    <div className="flex flex-col justify-center w-full">
                        <h3 className="text-sm font-medium text-blue-700 mb-2">
                            Como funciona o processo de envio seguro?
                        </h3>

                        <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
                            <li>Compartilhamento da Chave Pública:
                                A chave pública do destinatário é compartilhada previamente, garantindo que a comunicação seja confiável e segura.</li>
                            <li>Validação e Integração:
                                Antes do envio, valida-se a integridade do arquivo usando hashes (como SHA-256) para verificar se ele não foi alterado durante a transferência.</li>
                            <li>Envio do Arquivo:
                                O arquivo e a chave pública são enviados utilizando um canal seguro, como HTTPS, ou por meio de mecanismos de transporte confiáveis para evitar interceptações.</li>
                            <li>Recepção e Verificação:
                                O destinatário realiza verificações automáticas para assegurar que o arquivo chegou intacto e que o remetente é legítimo, garantindo um envio seguro.</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>

            <div className="p-4 bg-white rounded-lg border border-amber-100">
                <h4 className="text-sm font-medium text-green-600 mb-2">Dicas de Segurança</h4>
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
