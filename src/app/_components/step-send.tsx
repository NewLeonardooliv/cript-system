import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Send, User, Package, Shield, Info } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export function StepSend() {
    const [isSending, setIsSending] = useState(false);
    const [isDelivered, setIsDelivered] = useState(false);

    const animationDuration = 2;

    const handleSendPackage = () => {
        setIsSending(true);
        setTimeout(() => {
            setIsSending(false);
            setIsDelivered(true);
            toast.success('Pacote recebido com sucesso!');
        }, animationDuration * 1000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 w-full max-w-3xl mx-auto"
        >
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Empacotamento e Envio</h2>
                <p className="text-gray-600">
                    Nesta etapa, todos os elementos processados são combinados em um único pacote seguro para envio.
                </p>
            </div>

            <div className="bg-white p-6 rounded-lg border shadow-sm">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5 text-blue-600" />
                    Componentes do pacote:
                </h3>

                <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                        <Shield className="w-4 h-4 text-green-600" />
                        Arquivo cifrado com chave simétrica
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                        <Shield className="w-4 h-4 text-blue-600" />
                        Assinatura digital do arquivo original
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                        <Shield className="w-4 h-4 text-purple-600" />
                        Chave simétrica cifrada com RSA
                    </li>
                </ul>

                <div className="relative h-40 my-8">
                    <div className="absolute top-1/2 left-12 right-12 h-1 bg-gray-200 transform -translate-y-1/2" />

                    {isSending && (
                        <motion.div
                            className="absolute top-1/2 left-12 h-1 bg-blue-500 transform -translate-y-1/2"
                            initial={{ width: 0 }}
                            animate={{ width: 'calc(100% - 6rem)' }}
                            transition={{ duration: animationDuration, ease: "linear" }}
                        />
                    )}
                    {isDelivered && (
                        <div className="absolute top-1/2 left-12 right-12 h-1 bg-green-500 transform -translate-y-1/2" />
                    )}

                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 flex flex-col items-center">
                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-sm mt-2">Aluno</span>
                    </div>

                    {isSending && (
                        <motion.div
                            className="absolute top-1/2 transform -translate-y-1/2"
                            initial={{ left: '48px' }}
                            animate={{ left: 'calc(100% - 48px)' }}
                            transition={{ duration: animationDuration, ease: "linear" }}
                        >
                            <Package className="w-8 h-8 text-blue-500" />
                        </motion.div>
                    )}

                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 flex flex-col items-center">
                        <div className={`w-12 h-12 ${isDelivered ? 'bg-green-500' : 'bg-blue-500'} rounded-full flex items-center justify-center transition-colors duration-300`}>
                            <User className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-sm mt-2">Professor</span>
                    </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                    <div className="flex items-start gap-2">
                        <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                            <h4 className="font-medium text-blue-800 mb-2">O pacote é enviado de forma segura, garantindo:</h4>
                            <ul className="space-y-1 text-sm text-blue-700">
                                <li>• Confidencialidade (através da cifragem)</li>
                                <li>• Autenticidade (através da assinatura digital)</li>
                                <li>• Integridade (através do hash)</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                className="w-full"
                                onClick={handleSendPackage}
                                disabled={isSending || isDelivered}
                            >
                                <Send className="w-4 h-4 mr-2" />
                                {isSending ? 'Enviando...' : isDelivered ? 'Enviado!' : 'Enviar Pacote'}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Enviar pacote criptografado</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </motion.div>
    );
}
