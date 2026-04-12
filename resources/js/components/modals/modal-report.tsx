import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ModalReportProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  postId: number;
}

function ModalReport({ open, onOpenChange, postId }: ModalReportProps) {
  const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
    post_id: postId,
    reason: '',
  });

  useEffect(() => {
    setData('post_id', postId);
  }, [postId, setData]);

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen) {
      reset('reason');
      clearErrors();
    }

    onOpenChange(nextOpen);
  };

  const submitReport = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    post('/reports', {
      preserveScroll: true,
      onSuccess: () => {
        reset('reason');
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="border-pf-border bg-pf-surface text-pf-text shadow-sm dark:border-pf-border-dark dark:bg-pf-surface-dark dark:text-pf-text-dark">
        <form onSubmit={submitReport} className="space-y-4">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-pf-text dark:text-pf-text-dark">
              Reportar experiencia
            </DialogTitle>
            <DialogDescription className="text-pf-text-3 dark:text-pf-text-3dark">
              Explica breument quin problema has detectat en aquesta publicació.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="report-reason" className="text-pf-text dark:text-pf-text-dark">Motiu</Label>
            <Textarea
              id="report-reason"
              value={data.reason}
              onChange={(event) => setData('reason', event.target.value)}
              maxLength={255}
              placeholder="Ex: contingut ofensiu, spam, informació falsa..."
              className="min-h-30 border-pf-border bg-pf-surface-2 text-pf-text placeholder:text-pf-text-3 focus-visible:border-pf-primary dark:border-pf-border-dark dark:bg-pf-surface-2dark dark:text-pf-text-dark dark:placeholder:text-pf-text-3dark dark:focus-visible:border-pf-primary-dark"
            />
            <div className="text-right text-xs text-pf-text-3 dark:text-pf-text-3dark">
              {data.reason.length}/255
            </div>
            <InputError message={errors.reason} />
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
              disabled={processing || !data.reason.trim()}
              className="bg-pf-primary text-white hover:bg-pf-primary-h dark:bg-pf-primary-dark dark:hover:bg-pf-primary-hdark"
            >
              {processing ? 'Enviant...' : 'Enviar report'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ModalReport;