import { Link, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowLeft,
    FolderTree,
    LayoutGrid,
    Users,
    CircleAlert,
    AlignLeft,
} from 'lucide-react';
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
    const { auth } = usePage<{ auth: Auth }>().props;
    const user = auth?.user;
    const { isCurrentUrl } = useCurrentUrl();

    const isAdmin = user?.role === 'admin';
    
    const navResum: NavItem[]=[
        { title: 'Resum', href: '/admin', icon: LayoutGrid },
    ]
    const navContingut: NavItem[]=[
        ...(isAdmin
            ? [
                  {
                      title: 'Categories',
                      href: '/admin/category',
                      icon: AlignLeft,
                  },
              ]
            : []),
        { title: 'Abusos Reportats', href: '/admin/reports', icon: CircleAlert },

    ]
    const navUsuaris: NavItem[]=[
        ...(isAdmin
            ? [
                  { title: 'Usuaris', href: '/admin/users', icon: Users },
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
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/admin">
                                <img
                                    src="/img/Logo_petit.png"
                                    alt="PathFinder"
                                    className="h-8 w-8 rounded-md object-cover"
                                />
                                <div className="ml-1 grid flex-1 text-left text-sm">
                                    <span className="truncate leading-tight font-semibold">
                                        PathFinder
                                    </span>
                                    <span className="truncate text-xs text-muted-foreground">
                                        Administració
                                    </span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup className="px-2 py-0">
                    <SidebarGroupLabel>Resum</SidebarGroupLabel>
                    <SidebarMenu>
                        {navResum.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={isCurrentUrl(item.href)}
                                    tooltip={{ children: item.title }}
                                >
                                    <Link href={item.href} prefetch>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                    <SidebarGroupLabel>Contingut</SidebarGroupLabel>
                    <SidebarMenu>
                        {navContingut.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={isCurrentUrl(item.href)}
                                    tooltip={{ children: item.title }}
                                >
                                    <Link href={item.href} prefetch>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                    <SidebarGroupLabel>Gestió Usuaris</SidebarGroupLabel>
                    <SidebarMenu>
                        {navUsuaris.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={isCurrentUrl(item.href)}
                                    tooltip={{ children: item.title }}
                                >
                                    <Link href={item.href} prefetch>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            tooltip={{ children: 'Tornar a la web' }}
                        >
                            <Link
                                href={home()}
                                className="text-muted-foreground hover:text-foreground"
                            >
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
