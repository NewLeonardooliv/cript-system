/* eslint-disable @typescript-eslint/no-explicit-any */
import { useStepperContext } from '@/contexts/step-context';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { ChevronRight } from 'lucide-react';

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
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="mb-8 md:lg:min-h-[400px] lg:min-h-[600px]"
        >
          {React.cloneElement(steps[currentStep].content as React.ReactElement, {
            stepData,
            setStepData: (data: any) => setStepData(currentStep, data),
          })}
        </motion.div>
      </AnimatePresence>
      <div className="flex justify-between">
        <Button
          onClick={handlePrevious}
          disabled={currentStep === 0}
        >
          Anterior
        </Button>
        <Button
          onClick={handleNext}
          disabled={currentStep === steps.length - 1}
        >
          {currentStep === steps.length - 1 ? 'Terminar' : 'Próximo'}
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default StepContent;

