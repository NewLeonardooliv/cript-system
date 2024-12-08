'use client';

import { StepDecrypt } from '@/app/_components/step-decrypt';
import { StepGenerateKeys } from '@/app/_components/step-generate-keys';
import { StepPreparation } from '@/app/_components/step-prepare';
import { StepProtection } from '@/app/_components/step-protection';
import { StepSend } from '@/app/_components/step-send';
import { StepSignature } from '@/app/_components/step-signature';
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
} from '@/components/ui/sidebar';
import { useState } from 'react';
import Stepper from './stepper';

export function AppSidebar() {
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
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Etapas</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <Stepper steps={steps} hiddenContent={true} />
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
