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
    const [stepData, setStepData] = useState({});
    const steps = [
        {
            title: 'Geração de Chaves',
            content: <StepGenerateKeys />,
        },
        {
            title: 'Preparação',
            content: <StepPreparation />,
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
            content: <StepSend stepData={stepData} setStepData={setStepData} />,
        },
        {
            title: 'Descriptografia',
            content: (
                <StepDecrypt stepData={stepData} setStepData={setStepData} />
            ),
        },
    ];

    return (
        <div className="mx-28 w-full min-h-fit flex">
            <Stepper steps={steps} />
        </div>
    );
};

export default Home;
