/* eslint-disable @typescript-eslint/no-explicit-any */
import { useStepperContext } from '@/contexts/step-context';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type StepType = {
  title: string;
  content: React.ReactNode;
};

type StepContentProps = {
  steps: StepType[];
};

const StepContent: React.FC<StepContentProps> = ({ steps }) => {
  const { currentStep, stepData, setCurrentStep, setStepData } = useStepperContext();

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
    <div className="bg-gray-50 rounded-lg p-6 shadow-inner">
      <h2 className="text-2xl font-semibold mb-6 text-blue-600">{steps[currentStep].title}</h2>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          {React.cloneElement(steps[currentStep].content as React.ReactElement, {
            stepData,
            setStepData: (data: any) => setStepData(currentStep, data),
          })}
        </motion.div>
      </AnimatePresence>
      <div className="flex justify-between">
        <motion.button
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 transition-colors duration-200"
          onClick={handlePrevious}
          disabled={currentStep === 0}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Anterior
        </motion.button>
        <motion.button
          className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-opacity-50 transition-colors duration-200"
          onClick={handleNext}
          disabled={currentStep === steps.length - 1}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {currentStep === steps.length - 1 ? 'Terminar' : 'Próximo'}
        </motion.button>
      </div>
    </div>
  );
};

export default StepContent;

