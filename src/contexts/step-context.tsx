/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState } from 'react';

type StepperContextType = {
    currentStep: number;
    stepData: Record<number, any>;
    setCurrentStep: (step: number) => void;
    setStepData: (step: number, data: any) => void;
};

const StepperContext = createContext<StepperContextType | undefined>(undefined);

export const StepperProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [stepData, setStepData] = useState<Record<number, any>>({});

    const updateStepData = (step: number, data: any) => {
        setStepData((prevData) => ({ ...prevData, [step]: data }));
    };

    return (
        <StepperContext.Provider
            value={{
                currentStep,
                stepData,
                setCurrentStep,
                setStepData: updateStepData,
            }}
        >
            {children}
        </StepperContext.Provider>
    );
};

export const useStepperContext = () => {
    const context = useContext(StepperContext);
    if (context === undefined) {
        throw new Error(
            'useStepperContext must be used within a StepperProvider'
        );
    }
    return context;
};
