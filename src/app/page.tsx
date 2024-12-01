/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Stepper from '@/components/stepper';
import React, { useState } from 'react';
import { StepGenerateKeys } from './_components/step-generate-keys';
import { StepPrepare } from './_components/step-prepare';
import { StepSignature } from './_components/step-signature';
import { StepProtection } from './_components/step-protection';
import { StepSend } from './_components/step-send';
import { StepDecrypt } from './_components/step-decrypt';

const Home: React.FC = () => {
  const [stepData, setStepData] = useState({});
  const steps = [
    {
      title: 'Geração de Chaves',
      content: <StepGenerateKeys stepData={stepData} setStepData={setStepData} />
    },
    {
      title: 'Preparação',
      content: <StepPrepare stepData={stepData} setStepData={setStepData} />
    },
    {
      title: 'Assinatura',
      content: <StepSignature stepData={stepData} setStepData={setStepData} />
    },
    {
      title: 'Proteção',
      content: <StepProtection stepData={stepData} setStepData={setStepData} />
    },
    {
      title: 'Envio',
      content: <StepSend stepData={stepData} setStepData={setStepData} />
    },
    {
      title: 'Descriptografia',
      content: <StepDecrypt stepData={stepData} setStepData={setStepData} />
    },
  ];

  return (
    <div className="mx-28 min-h-screen flex items-center justify-center">
      <Stepper steps={steps} />
    </div>
  );
};

export default Home;

