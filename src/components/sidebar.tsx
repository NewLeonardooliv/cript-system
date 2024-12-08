import {
    FileKey,
    KeyRound,
    LockKeyhole,
    LockKeyholeOpen,
    Send,
    ShieldCheck,
} from 'lucide-react';

import { Separator } from '@/components/ui/separator';

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';

// Menu items.
const items = [
    {
        title: 'Geração de Chaves',
        icon: KeyRound,
    },
    {
        title: 'Preparação',
        icon: FileKey,
    },
    {
        title: 'Assinatura',
        icon: LockKeyhole,
    },
    {
        title: 'Proteção',
        icon: ShieldCheck,
    },
    {
        title: 'Envio',
        icon: Send,
    },
    {
        title: 'Descriptografia',
        icon: LockKeyholeOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Etapas</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <div>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </div>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                            {/* {!items.at(-1) && (
                                <Separator orientation="vertical"/>
                            )} */}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
