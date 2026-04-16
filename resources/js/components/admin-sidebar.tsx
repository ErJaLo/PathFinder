import { Link, usePage } from '@inertiajs/react';
import {useForm} from '@inertiajs/react';

import {
    AlertTriangle,
    ArrowLeft,
    FolderTree,
    LayoutGrid,
    Users,
    CircleAlert,
    AlignLeft,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { route } from 'ziggy-js';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { home } from '@/routes';
import type { Auth, NavItem } from '@/types';

export function AdminSidebar() {
    const { auth, globalData } = usePage<{ auth: Auth, globalData: { totalReports: number } }>().props;
    const user = auth?.user;
    const { isCurrentUrl } = useCurrentUrl();
    
    const isAdmin = user?.role === 'admin';
    
    const navResum: any[]=[
        { title: 'Resum', href: '/admin', icon: LayoutGrid },
    ]
    const navContingut: any[]=[
        ...(isAdmin
            ? [
                  {
                      title: 'Gestió de categories',
                      href: '/admin/category',
                      icon: AlignLeft,
                  },
              ]
            : []),
        { title: 'Abusos reportats', href: '/admin/reports', icon: CircleAlert, badge: globalData?.totalReports },

    ]
    const navUsuaris: any[]=[
        ...(isAdmin
            ? [
                  { title: "Gestió d'usuaris", href: '/admin/users', icon: Users },
              ]
            : []),
    ]
    const navItems: NavItem[] = [
        { title: 'Dashboard', href: '/admin', icon: LayoutGrid },
        { title: 'Reports', href: '/admin/reports', icon: AlertTriangle },
        ...(isAdmin
            ? [
                  {
                      title: 'Categories',
                      href: '/admin/categories',
                      icon: FolderTree,
                  },
                  { title: 'Usuaris', href: '/admin/users', icon: Users },
              ]
            : []),
    ];

    return (
        <Sidebar 
            collapsible="icon" 
            variant="inset" 
            className="border-r border-pf-text bg-pf-text text-white [&_[data-sidebar=sidebar]]:bg-pf-text [&_[data-slot=sidebar-inner]]:bg-pf-text"
        >
            <SidebarHeader className="border-b border-white/5 pb-4 pt-5 bg-pf-text">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="hover:bg-white/10 hover:text-white bg-pf-text text-white">
                            <Link href="/">
                                <img
                                    src="/img/Logo_petit.png"
                                    alt="PathFinder"
                                    className="h-8 w-8 rounded object-cover"
                                />
                                <div className="ml-2 grid flex-1 text-left">
                                    <span className="truncate text-lg font-bold tracking-wide text-white font-serif">
                                        PathFinder
                                    </span>
                                    <span className="truncate text-xs font-bold tracking-widest text-pf-accent uppercase">
                                        Administració
                                    </span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="gap-0 pt-4 bg-pf-text text-white">
                <SidebarGroup className="px-3">
                    <SidebarGroupLabel className="px-2 text-xs font-bold tracking-wider text-white/30 uppercase">General</SidebarGroupLabel>
                    <SidebarMenu>
                        {navResum.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={isCurrentUrl(item.href)}
                                    tooltip={{ children: item.title }}
                                    className={`my-0.5 rounded-md transition-colors ${
                                        isCurrentUrl(item.href) 
                                            ? 'bg-pf-primary text-white data-[active=true]:bg-pf-primary data-[active=true]:text-white data-[active=true]:font-bold' 
                                            : 'text-white/60 hover:bg-white/10 hover:text-white'
                                    }`}
                                >
                                    <Link href={item.href} prefetch>
                                        {item.icon && <item.icon className="h-4 w-4" />}
                                        <span className="font-medium text-sm">{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>

                <SidebarGroup className="px-3 mt-2">
                    <SidebarGroupLabel className="px-2 text-xs font-bold tracking-wider text-white/30 uppercase">Contingut</SidebarGroupLabel>
                    <SidebarMenu>
                        {navContingut.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={isCurrentUrl(item.href)}
                                    tooltip={{ children: item.title }}
                                    className={`my-0.5 rounded-md transition-colors ${
                                        isCurrentUrl(item.href) 
                                            ? 'bg-pf-primary text-white data-[active=true]:bg-pf-primary data-[active=true]:text-white data-[active=true]:font-bold' 
                                            : 'text-white/60 hover:bg-white/10 hover:text-white'
                                    }`}
                                >
                                    <Link href={item.href} prefetch className="flex w-full items-center">
                                        {item.icon && <item.icon className="h-4 w-4" />}
                                        <span className="font-medium text-sm flex-1">{item.title}</span>
                                        {item.badge && (
                                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white shadow-sm">
                                                {item.badge}
                                            </span>
                                        )}
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>

                <SidebarGroup className="px-3 mt-2">
                    <SidebarGroupLabel className="px-2 text-xs font-bold tracking-wider text-white/30 uppercase">Usuaris</SidebarGroupLabel>
                    <SidebarMenu>
                        {navUsuaris.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={isCurrentUrl(item.href)}
                                    tooltip={{ children: item.title }}
                                    className={`my-0.5 rounded-md transition-colors ${
                                        isCurrentUrl(item.href) 
                                            ? 'bg-pf-primary text-white data-[active=true]:bg-pf-primary data-[active=true]:text-white data-[active=true]:font-bold' 
                                            : 'text-white/60 hover:bg-white/10 hover:text-white'
                                    }`}
                                >
                                    <Link href={item.href} prefetch>
                                        {item.icon && <item.icon className="h-4 w-4" />}
                                        <span className="font-medium text-sm">{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="bg-pf-text border-t border-white/5 [&_[data-test=sidebar-menu-button]]:!text-white [&_[data-test=sidebar-menu-button]:hover]:!bg-white/10 [&_[data-test=sidebar-menu-button][data-state=open]]:!bg-white/10">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            tooltip={{ children: 'Tornar a la web' }}
                            className="text-white/60 hover:bg-white/10 hover:text-white"
                        >
                            <Link href={home()}>
                                <ArrowLeft />
                                <span>Tornar a la web</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
