import React from 'react';

import { StepperProvider } from '@/contexts/step-context';
import Step from './step';
import StepContent from './step-content';

type StepType = {
    title: string;
    content: React.ReactNode;
};

type StepperProps = {
    steps: StepType[];
};

const Stepper: React.FC<StepperProps> = ({ steps }) => {
    return (
        <StepperProvider>
            <div className="w-full mx-auto bg-white rounded-xl p-8 flex flex-col gap-4">
                <div className="flex justify-between mb-8">
                    {steps.map((step, index) => (
                        <Step
                            key={index}
                            stepNumber={index}
                            title={step.title}
                        />
                    ))}
                </div>
                <StepContent steps={steps} />
            </div>
        </StepperProvider>
    );
};

export default Stepper;
