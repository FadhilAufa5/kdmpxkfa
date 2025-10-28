import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { UserMenuContent } from '@/components/user-menu-content';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { ChevronsUpDown } from 'lucide-react';

export function NavUser() {
    const { auth } = usePage<SharedData>().props;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="inline-flex items-center gap-2 rounded-full px-2 py-1">
                    <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                        <AvatarImage src={auth.user?.avatar} alt={auth.user?.name} />
                        <AvatarFallback className="bg-neutral-100 text-neutral-800">{(auth.user?.name || 'U').charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="hidden truncate text-sm font-medium md:inline-block">{auth.user?.name}</span>
                    <ChevronsUpDown className="ml-1 h-4 w-4 text-muted-foreground" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56 rounded-lg" align="end">
                <UserMenuContent user={auth.user} />
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
