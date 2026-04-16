import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ToggleUserStatus {
  id: number;
  name: string;
  status: 'active' | 'inactive';
}

interface ModalUserToggleStatusProps {
  open: boolean;
  user: ToggleUserStatus | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: (id: number) => void;
}

function ModalUserToggleStatus({
  open,
  user,
  onOpenChange,
  onConfirm,
}: ModalUserToggleStatusProps) {
  if (!user) {
    return null;
  }

  const willDisable = user.status === 'active';
  const title = willDisable ? 'Deshabilitar usuari' : 'Habilitar usuari';
  const confirmLabel = willDisable ? 'Deshabilitar' : 'Habilitar';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-pf-border bg-pf-surface text-pf-text shadow-sm dark:border-pf-border-dark dark:bg-pf-surface-dark dark:text-pf-text-dark">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-pf-text dark:text-pf-text-dark">
            {title}
          </DialogTitle>
          <DialogDescription className="text-pf-text-3 dark:text-pf-text-3dark">
            {willDisable ? 'Segur que vols deshabilitar' : 'Segur que vols habilitar'}{' '}
            <span className="font-medium text-pf-text dark:text-pf-text-dark">
              {user.name}
            </span>
            ?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="border-t border-pf-border pt-3 dark:border-pf-border-dark">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-pf-border text-pf-text-3 hover:border-pf-primary hover:bg-pf-primary-l hover:text-pf-primary dark:border-pf-border-dark dark:text-pf-text-3dark dark:hover:border-pf-primary-dark dark:hover:bg-pf-primary-ldark dark:hover:text-pf-primary-dark"
          >
            Cancel·lar
          </Button>
          <Button
            type="button"
            onClick={() => onConfirm(user.id)}
            className={willDisable
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-pf-accent text-white hover:opacity-90 dark:bg-pf-accent-dark'}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ModalUserToggleStatus;
