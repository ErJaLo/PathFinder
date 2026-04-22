import { Check, ChevronsUpDown } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type { ExperienceCountry } from '@/types';

function countryFlag(code: string): string {
    const base = 0x1f1e6 - 65;
    const upper = code.toUpperCase();
    return String.fromCodePoint(upper.charCodeAt(0) + base, upper.charCodeAt(1) + base);
}

type Props = {
    countries: ExperienceCountry[];
    value: string;
    onChange: (code: string) => void;
    placeholder?: string;
    id?: string;
};

const CONTINENT_ORDER = ['Europa', 'Àsia', 'Àfrica', 'Amèrica', 'Oceania'];

export function CountryCombobox({ countries, value, onChange, placeholder = 'Selecciona un pais...', id }: Props) {
    const [open, setOpen] = useState(false);

    const grouped = useMemo(() => {
        const map = new Map<string, ExperienceCountry[]>();
        for (const c of countries) {
            const key = c.continent || 'Altres';
            if (!map.has(key)) map.set(key, []);
            map.get(key)!.push(c);
        }
        // Sort countries within each continent by name
        for (const arr of map.values()) {
            arr.sort((a, b) => a.name.localeCompare(b.name, 'ca'));
        }
        // Sort continents according to preferred order, unknowns last
        const sortedKeys = Array.from(map.keys()).sort((a, b) => {
            const ia = CONTINENT_ORDER.indexOf(a);
            const ib = CONTINENT_ORDER.indexOf(b);
            if (ia === -1 && ib === -1) return a.localeCompare(b);
            if (ia === -1) return 1;
            if (ib === -1) return -1;
            return ia - ib;
        });
        return sortedKeys.map((k) => ({ continent: k, countries: map.get(k)! }));
    }, [countries]);

    const selected = countries.find((c) => c.code === value);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    id={id}
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="h-10 w-full justify-between text-pf-text dark:text-pf-text-dark"
                >
                    {selected ? (
                        <span className="flex items-center gap-2">
                            <span>{countryFlag(selected.code)}</span>
                            <span>{selected.name}</span>
                        </span>
                    ) : (
                        <span className="text-pf-text-3 dark:text-pf-text-3dark">{placeholder}</span>
                    )}
                    <ChevronsUpDown className="h-4 w-4 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <Command>
                    <CommandInput placeholder="Busca pais..." />
                    <CommandList className="max-h-[300px]">
                        <CommandEmpty>Cap pais trobat.</CommandEmpty>
                        {value && (
                            <CommandGroup>
                                <CommandItem
                                    value="__clear__"
                                    onSelect={() => {
                                        onChange('');
                                        setOpen(false);
                                    }}
                                    className="text-pf-text-3 italic dark:text-pf-text-3dark"
                                >
                                    Esborrar seleccio
                                </CommandItem>
                            </CommandGroup>
                        )}
                        {grouped.map(({ continent, countries: list }) => (
                            <CommandGroup key={continent} heading={continent}>
                                {list.map((c) => (
                                    <CommandItem
                                        key={c.code}
                                        value={`${c.name} ${c.code}`}
                                        onSelect={() => {
                                            onChange(c.code);
                                            setOpen(false);
                                        }}
                                    >
                                        <span className="mr-2">{countryFlag(c.code)}</span>
                                        <span>{c.name}</span>
                                        <Check className={cn('ml-auto h-4 w-4', value === c.code ? 'opacity-100' : 'opacity-0')} />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        ))}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
