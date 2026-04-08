import { Link, router } from '@inertiajs/react';
import { LogOut, Settings } from 'lucide-react';
import {
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { logout } from '@/routes';
import { edit } from '@/routes/profile';
import type { User } from '@/types';

type Props = {
    user: User;
};

export function UserMenuContent({ user }: Props) {
    const cleanup = useMobileNavigation();

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    return (
        <div className="bg-pf-text text-white rounded-lg -m-1 p-1">
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm text-white">
                    <UserInfo user={user} showEmail={true} />
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuGroup>
                <DropdownMenuItem asChild className="text-white/80 focus:bg-white/10 focus:text-white hover:bg-white/10 hover:text-white cursor-pointer rounded-md transition-colors">
                    <Link
                        className="flex w-full items-center p-2"
                        href={edit()}
                        prefetch
                        onClick={cleanup}
                    >
                        <Settings className="mr-2 inline-block" />
                        Settings
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-white/10 my-1" />
            <DropdownMenuItem asChild className="text-white/80 focus:bg-white/10 focus:text-white hover:bg-white/10 hover:text-white cursor-pointer rounded-md transition-colors">
                <Link
                    className="flex w-full items-center p-2"
                    href={logout()}
                    as="button"
                    onClick={handleLogout}
                    data-test="logout-button"
                >
                    <LogOut className="mr-2 inline-block" />
                    Log out
                </Link>
            </DropdownMenuItem>
        </div>
    );
}
