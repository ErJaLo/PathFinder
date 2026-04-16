import { useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { route } from 'ziggy-js';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ModalUserCreateProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function ModalUserCreate({ open, onOpenChange }: ModalUserCreateProps) {
  const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
    name: '',
    surname: '',
    email: '',
    role: 'user' as 'admin' | 'user',
    password: '',
    password_confirmation: '',
  });

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen) {
      clearErrors();
      reset();
    }

    onOpenChange(nextOpen);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    post(route('admin.users.store'), {
      preserveScroll: true,
      onSuccess: () => {
        reset();
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl border-pf-border bg-pf-surface text-pf-text shadow-sm dark:border-pf-border-dark dark:bg-pf-surface-dark dark:text-pf-text-dark">
        <form onSubmit={submit} className="space-y-4">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-pf-text dark:text-pf-text-dark">
              Nou usuari
            </DialogTitle>
            <DialogDescription className="text-pf-text-3 dark:text-pf-text-3dark">
              Crea un nou usuari de la plataforma.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="create-user-name" className="text-pf-text dark:text-pf-text-dark">Nom</Label>
              <Input
                id="create-user-name"
                value={data.name}
                onChange={(event) => setData('name', event.target.value)}
                className="border-pf-border bg-pf-surface-2 text-pf-text dark:border-pf-border-dark dark:bg-pf-surface-2dark dark:text-pf-text-dark"
              />
              <InputError message={errors.name} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="create-user-surname" className="text-pf-text dark:text-pf-text-dark">Cognoms</Label>
              <Input
                id="create-user-surname"
                value={data.surname}
                onChange={(event) => setData('surname', event.target.value)}
                className="border-pf-border bg-pf-surface-2 text-pf-text dark:border-pf-border-dark dark:bg-pf-surface-2dark dark:text-pf-text-dark"
              />
              <InputError message={errors.surname} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="create-user-email" className="text-pf-text dark:text-pf-text-dark">Email</Label>
            <Input
              id="create-user-email"
              type="email"
              value={data.email}
              onChange={(event) => setData('email', event.target.value)}
              className="border-pf-border bg-pf-surface-2 text-pf-text dark:border-pf-border-dark dark:bg-pf-surface-2dark dark:text-pf-text-dark"
            />
            <InputError message={errors.email} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="create-user-role" className="text-pf-text dark:text-pf-text-dark">Rol</Label>
            <select
              id="create-user-role"
              value={data.role}
              onChange={(event) => setData('role', event.target.value as 'admin' | 'user')}
              className="h-10 w-full rounded-md border border-pf-border bg-pf-surface-2 px-3 text-sm text-pf-text focus:ring-2 focus:ring-pf-primary focus:outline-none dark:border-pf-border-dark dark:bg-pf-surface-2dark dark:text-pf-text-dark dark:focus:ring-pf-primary-dark"
            >
              <option value="user">Usuari</option>
              <option value="admin">Admin</option>
            </select>
            <InputError message={errors.role} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="create-user-password" className="text-pf-text dark:text-pf-text-dark">Contrasenya</Label>
              <Input
                id="create-user-password"
                type="password"
                value={data.password}
                onChange={(event) => setData('password', event.target.value)}
                className="border-pf-border bg-pf-surface-2 text-pf-text dark:border-pf-border-dark dark:bg-pf-surface-2dark dark:text-pf-text-dark"
              />
              <InputError message={errors.password} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="create-user-password-confirm" className="text-pf-text dark:text-pf-text-dark">Confirmar contrasenya</Label>
              <Input
                id="create-user-password-confirm"
                type="password"
                value={data.password_confirmation}
                onChange={(event) => setData('password_confirmation', event.target.value)}
                className="border-pf-border bg-pf-surface-2 text-pf-text dark:border-pf-border-dark dark:bg-pf-surface-2dark dark:text-pf-text-dark"
              />
            </div>
          </div>

          <DialogFooter className="border-t border-pf-border pt-3 dark:border-pf-border-dark">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleClose(false)}
              disabled={processing}
              className="border-pf-border text-pf-text-3 hover:border-pf-primary hover:bg-pf-primary-l hover:text-pf-primary dark:border-pf-border-dark dark:text-pf-text-3dark dark:hover:border-pf-primary-dark dark:hover:bg-pf-primary-ldark dark:hover:text-pf-primary-dark"
            >
              Cancel·lar
            </Button>
            <Button
              type="submit"
              disabled={processing}
              className="bg-pf-primary text-white hover:bg-pf-primary-h dark:bg-pf-primary-dark dark:hover:bg-pf-primary-hdark"
            >
              {processing ? 'Creant...' : 'Crear usuari'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ModalUserCreate;
