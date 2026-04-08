import { ExperienceCard } from "@/components/experience-card";
import {
    Dialog, DialogTrigger, DialogContent,
    DialogHeader, DialogTitle, DialogDescription,
    DialogFooter, DialogClose,
} from '@/components/ui/dialog';
import { Button } from "node_modules/@headlessui/react/dist/components/button/button";

type Props = {
    experiences: PaginatedData<Experience>;  // Reutilitza el tipus d'explorar
    currentStatus: string;
};

const statusFilters = [
    { key: '', label: 'Totes' },
    { key: 'published', label: 'Publicades' },
    { key: 'draft', label: 'Esborranys' },
];



<Dialog>
    <DialogTrigger asChild>
        <Button variant="outline" size="sm">Eliminar</Button>
    </DialogTrigger>
    <DialogContent>
        <DialogHeader>
            <DialogTitle>Eliminar experiencia</DialogTitle>
            <DialogDescription>
                Segur que vols eliminar "{experience.title}"? Aquesta accio no es pot desfer.
            </DialogDescription>
        </DialogHeader>
        <DialogFooter>
            <DialogClose asChild>
                <Button variant="outline">Cancel·lar</Button>
            </DialogClose>
            <Button
                variant="destructive"
                onClick={() => router.delete(`/experiencies/${experience.id}`)}
            >
                Eliminar
            </Button>
        </DialogFooter>
    </DialogContent>
</Dialog>