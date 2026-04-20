import { Link, useForm } from '@inertiajs/react';
import { LogOut, Settings, User as UserIcon } from 'lucide-react';
import React from 'react';
import { route } from 'ziggy-js';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { User } from '@/types/auth';

type UserDropdownProps = {
    user: User;
    initials: string | React.ReactNode;
};

export function UserDropdown({ user, initials }: UserDropdownProps) {
    const logoutForm = useForm();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="flex items-center justify-center rounded-full transition-transform hover:scale-105 focus:outline-none">
                    <div className="w-10 h-10 rounded-full bg-pf-surface-2 dark:bg-pf-surface-2dark flex items-center justify-center font-medium text-pf-text dark:text-white text-sm">
                        {initials}
                    </div>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-pf-surface dark:bg-pf-surface-dark border-pf-border dark:border-pf-border-dark p-0 text-pf-text dark:text-white/90 shadow-md">
                <div className="flex flex-col px-4 py-3 border-b border-pf-border dark:border-pf-border-dark">
                    <span className="font-semibold text-pf-text dark:text-white text-sm truncate">{user.name}</span>
                    <span className="text-xs text-pf-text-2 dark:text-white/60 truncate">{user.email}</span>
                </div>
                <DropdownMenuGroup className="py-1">
                    <DropdownMenuItem asChild className="hover:bg-pf-primary-l dark:hover:bg-pf-border-dark focus:bg-pf-primary-l dark:focus:bg-pf-border-dark focus:text-pf-primary dark:focus:text-white cursor-pointer rounded-none border-none">
                        <Link href="/settings/profile" className="flex items-center gap-3 w-full px-4 py-2">
                            <UserIcon className="w-4 h-4 text-pf-text-3 dark:text-white/80" />
                            <span>Perfil</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="hover:bg-pf-primary-l dark:hover:bg-pf-border-dark focus:bg-pf-primary-l dark:focus:bg-pf-border-dark focus:text-pf-primary dark:focus:text-white cursor-pointer rounded-none border-none">
                        <Link href="/settings/security" className="flex items-center gap-3 w-full px-4 py-2">
                            <Settings className="w-4 h-4 text-pf-text-3 dark:text-white/80" />
                            <span>Configuració</span>
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-pf-border dark:bg-pf-border-dark m-0" />
                <DropdownMenuItem 
                    className="hover:bg-pf-primary-l dark:hover:bg-pf-border-dark focus:bg-pf-primary-l dark:focus:bg-pf-border-dark focus:text-pf-primary dark:focus:text-white cursor-pointer rounded-none border-none py-1"
                    onSelect={() => logoutForm.post(route('logout'))}
                >
                    <div className="flex items-center gap-3 w-full px-4 py-2">
                        <LogOut className="w-4 h-4 text-pf-text-3 dark:text-white/80" />
                        <span>Tancar sessió</span>
                    </div>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
