'use client';

import React, { useState } from 'react';
import { StepGenerateKeys } from './_components/step-generate-keys';
import { StepSignature } from './_components/step-signature';
import { StepProtection } from './_components/step-protection';
import { StepSend } from './_components/step-send';
import { StepDecrypt } from './_components/step-decrypt';
import Stepper from '@/components/stepper';
import { StepPreparation } from './_components/step-prepare';

const Home: React.FC = () => {
    const [stepData, setStepData] = useState<{
        file: File | null;
        publicKey: File | null;
    }>({ file: null, publicKey: null });
    const steps = [
        {
            title: 'Geração de Chaves',
            content: <StepGenerateKeys setStepReady={() => { }} />,
        },
        {
            title: 'Preparação',
            content: <StepPreparation setStepData={setStepData} />,
        },
        {
            title: 'Assinatura',
            content: (
                <StepSignature stepData={stepData} setStepData={setStepData} />
            ),
        },
        {
            title: 'Proteção',
            content: (
                <StepProtection stepData={stepData} setStepData={setStepData} />
            ),
        },
        {
            title: 'Envio',
            content: <StepSend />,
        },
        {
            title: 'Descriptografia',
            content: (
                <StepDecrypt />
            ),
        },
    ];

    return (
        <div className="sm:mx-8 my-8 sm:my-0 md:mx-16 lg:mx-28 w-full min-h-fit flex">
            <Stepper steps={steps} hiddenSteps={true} />
        </div>
    );
};

export default Home;
