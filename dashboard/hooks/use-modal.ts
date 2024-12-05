import { Dispatch, SetStateAction, useCallback, useState } from "react";

interface UseDialog {
  dialogOpen: boolean;
  openDialog: () => void;
  closeDialog: () => void;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
}

export function useDialog(initialOpen = false): UseDialog {
  const [dialogOpen, setDialogOpen] = useState<boolean>(initialOpen);

  const openDialog = useCallback(() => {
    setDialogOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setDialogOpen(false);
  }, []);

  return { dialogOpen, openDialog, closeDialog, setDialogOpen };
}
