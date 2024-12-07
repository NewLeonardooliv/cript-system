import { useStepperContext } from '@/contexts/step-context';
import React from 'react';
import { motion } from 'framer-motion';

type StepProps = {
    stepNumber: number;
    title: string;
};

const Step: React.FC<StepProps> = ({ stepNumber, title }) => {
    const { currentStep, setCurrentStep } = useStepperContext();

    const isActive = stepNumber === currentStep;
    const isCompleted = stepNumber < currentStep;

    return (
        <motion.div
            className={`flex flex-1 flex-col items-center cursor-pointer ${
                isCompleted
                    ? 'text-emerald-500'
                    : isActive
                    ? 'text-blue-600'
                    : 'text-gray-400'
            }`}
            onClick={() => setCurrentStep(stepNumber)}
            whileTap={{ scale: 0.95 }}
        >
            <motion.div
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                    isCompleted
                        ? 'bg-emerald-100 text-emerald-500'
                        : isActive
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-400'
                }`}
                initial={{ scale: 0.8 }}
                animate={{ scale: isActive ? 1.1 : 1 }}
                transition={{ duration: 0.3 }}
            >
                {isCompleted ? (
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                ) : (
                    stepNumber + 1
                )}
            </motion.div>
            <span className="text-sm font-medium text-center">{title}</span>
        </motion.div>
    );
};

export default Step;
