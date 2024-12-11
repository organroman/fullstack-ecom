import { Loader } from "lucide-react";
import { Button } from "./ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

import { cn } from "@/lib/utils";

interface ModalProps {
  title: string;
  descriptionFirst: string;
  descriptionSecond?: string;
  buttonActionTitle: string;
  buttonActionTitleContinuous: string;
  children?: React.ReactNode;
  action?: (id?: number) => void;
  actionId?: number;
  submit?: boolean;
  formId?: string;
  isPending: boolean;
  destructive?: boolean;
}

const Modal = ({
  title,
  descriptionFirst,
  descriptionSecond,
  buttonActionTitle,
  buttonActionTitleContinuous,
  children,
  action,
  actionId,
  isPending,
  submit,
  formId,
  destructive,
}: ModalProps) => {
  return (
    <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
      <DialogHeader className="flex flex-col justify-center text-center">
        <DialogTitle
          className={cn(
            "text-center text-xl",
            destructive ? "text-red-500" : "text-primary"
          )}
        >
          {title}
        </DialogTitle>
        <DialogDescription className="text-center text-md">
          {descriptionFirst}
        </DialogDescription>
        <DialogDescription className="text-sm font-bold text-center">
          {descriptionSecond}
        </DialogDescription>
      </DialogHeader>
      {children}
      <DialogFooter className="sm:justify-start w-full mt-4">
        <DialogClose asChild>
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            disabled={isPending}
          >
            Cancel
          </Button>
        </DialogClose>
        <Button
          type={submit ? "submit" : "button"}
          form={submit ? formId : undefined}
          className="w-full"
          variant={destructive ? "destructive" : "default"}
          onClick={!submit && action ? () => action(actionId) : undefined}
          disabled={isPending}
        >
          {isPending ? (
            <div className="flex flex-row items-center">
              <Loader className="size-6 animate-spin text-slate-100 mr-2" />
              <span>{buttonActionTitleContinuous}</span>
            </div>
          ) : (
            buttonActionTitle
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default Modal;
