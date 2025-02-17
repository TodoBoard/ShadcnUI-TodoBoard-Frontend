import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { Security } from "@/lib/api";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface TwoFactorDisableDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function TwoFactorDisableDialog({
  open,
  onOpenChange,
  onSuccess,
}: TwoFactorDisableDialogProps) {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  const handleDisable = async () => {
    if (code.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    try {
      setIsLoading(true);
      await Security.disableTwoFactor(code);
      toast.success("2FA disabled successfully");
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error("Invalid verification code");
      setCode("");
      inputRef.current?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setCode("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[400px] p-0">
        <DialogHeader>
          <VisuallyHidden asChild>
            <DialogTitle>Disable Two-Factor Authentication</DialogTitle>
          </VisuallyHidden>
        </DialogHeader>
        <div className="px-8 py-6 space-y-8">
          <div className="space-y-2 text-center">
            <h2 className="text-xl font-semibold">
              Disable Two-Factor Authentication
            </h2>
            <p className="text-sm text-muted-foreground">
              This will remove the extra layer of security from your account.
              Please confirm by entering your authenticator code.
            </p>
          </div>

          <div className="space-y-6">
            <InputOTP
              ref={inputRef}
              value={code}
              onChange={setCode}
              maxLength={6}
              onComplete={handleDisable}
              containerClassName="group flex items-center justify-center has-[:disabled]:opacity-50"
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>

            <Button
              onClick={handleDisable}
              className="w-full h-10"
              variant="destructive"
              disabled={isLoading || code.length !== 6}
            >
              {isLoading ? "Disabling..." : "Disable 2FA"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
