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
    hiddenSteps?: boolean;
    hiddenContent?: boolean;
};

const Stepper: React.FC<StepperProps> = ({
    steps,
    hiddenSteps = false,
    hiddenContent = false,
}) => {
    return (
        <StepperProvider>
            <div className="w-full mx-auto bg-white rounded-xl p-8 flex lg:flex-col flex-row gap-12 lg:gap-4">
                <div
                    className={`${
                        hiddenSteps ? 'hidden lg:flex' : 'flex'
                    } flex-col lg:flex-row justify-between mb-8`}
                >
                    {steps.map((step, index) => (
                        <Step
                            key={index}
                            stepNumber={index}
                            title={step.title}
                        />
                    ))}
                </div>
                <StepContent steps={steps} hidden={hiddenContent} />
            </div>
        </StepperProvider>
    );
};

export default Stepper;
