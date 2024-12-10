/* eslint-disable @typescript-eslint/no-explicit-any */
import { useStepperContext } from '@/contexts/step-context';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { ChevronRight } from 'lucide-react';

type StepType = {
    title: string;
    content: React.ReactNode;
};

type StepContentProps = {
    steps: StepType[];
    hidden?: boolean;
};

const StepContent: React.FC<StepContentProps> = ({ steps, hidden = false }) => {
    const [stepReady, setStepReady] = useState(false);

    const { currentStep, stepData, setCurrentStep, setStepData } =
        useStepperContext();

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <div
            className={`md:bg-gray-50 rounded-lg md:p-6 md:shadow-inner w-full ${hidden ? 'hidden' : ''
                }`}
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="mb-8 min-h-fit"
                >
                    {React.cloneElement(
                        steps[currentStep].content as React.ReactElement,
                        {
                            stepData,
                            setStepData: (data: any) =>
                                setStepData(currentStep, data),
                            stepReady,
                            setStepReady,
                        }
                    )}
                </motion.div>
            </AnimatePresence>
            <div className={`w-full flex ${currentStep === 0 ? 'justify-end' : 'justify-between'}`}>
                <Button onClick={handlePrevious} className={currentStep === 0 ? 'hidden' : ''}>
                    Anterior
                </Button>
                {currentStep !== steps.length - 1 &&
                    <Button
                        onClick={handleNext}
                        disabled={(currentStep === steps.length - 1) || !stepReady}
                    >
                        {currentStep === steps.length - 1 ? 'Terminar' : 'Próximo'}
                        <ChevronRight className="w-4 h-4" />
                    </Button>}
            </div>
        </div>
    );
};

export default StepContent;
