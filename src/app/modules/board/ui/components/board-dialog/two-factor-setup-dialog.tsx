import {
  Dialog,
  DialogContent,
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
import { useState } from "react";
import QRCode from "react-qr-code";
import { toast } from "sonner";
import { Security } from "@/lib/api";
import { ArrowRight, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Image from "next/image";

interface TwoFactorSetupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const setupSteps = [
  {
    title: "Add Two-Factor Authentication",
    description:
      "Protect your account with an additional layer of security using your mobile device.",
  },
  {
    title: "Connect Your Authenticator",
    description:
      "Scan the QR code or enter the secret key in your authenticator app.",
  },
  {
    title: "Verify Setup",
    description:
      "Enter the 6-digit code from your authenticator app to complete the setup.",
  },
];

export function TwoFactorSetupDialog({
  open,
  onOpenChange,
  onSuccess,
}: TwoFactorSetupDialogProps) {
  const [step, setStep] = useState(0);
  const [setupData, setSetupData] = useState<{
    secret: string;
    provisioning_uri: string;
  } | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSetup = async () => {
    try {
      setIsLoading(true);
      const response = await Security.setupTwoFactor();
      setSetupData(response);
      setStep(1);
    } catch {
      toast.error("Failed to setup 2FA");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    if (verificationCode.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    try {
      setIsLoading(true);
      await Security.enableTwoFactor(verificationCode);
      toast.success("2FA enabled successfully");
      onSuccess();
      onOpenChange(false);
    } catch {
      toast.error("Invalid verification code");
      setVerificationCode("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setStep(0);
    setSetupData(null);
    setVerificationCode("");
    onOpenChange(false);
  };

  const copySecretToClipboard = () => {
    if (setupData?.secret) {
      navigator.clipboard.writeText(setupData.secret);
      toast.success("Secret copied to clipboard");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[400px] p-0">
        <DialogHeader>
          <VisuallyHidden asChild>
            <DialogTitle>{setupSteps[step].title}</DialogTitle>
          </VisuallyHidden>
        </DialogHeader>
        <div className="px-8 py-6 pb-4 space-y-8">
          <div className="space-y-2 text-center">
            <h2 className="text-xl font-semibold">{setupSteps[step].title}</h2>
            <p className="text-sm text-muted-foreground">
              {setupSteps[step].description}
            </p>
          </div>

          {step === 0 && (
            <div className="rounded-lg overflow-hidden">
              <Image
                className="w-full"
                src="/board/2fa/2fa.png"
                width={382}
                height={216}
                alt="Two-factor authentication"
              />
            </div>
          )}

          <div className="space-y-6">
            {step === 0 ? (
              <Button
                onClick={handleSetup}
                className="w-full group h-10"
                disabled={isLoading}
              >
                {isLoading ? "Setting up..." : "Begin Setup"}
                <ArrowRight
                  className="-me-1 ms-2 opacity-60 transition-transform group-hover:translate-x-0.5"
                  size={16}
                  strokeWidth={2}
                />
              </Button>
            ) : step === 1 && setupData ? (
              <>
                <div className="flex justify-center">
                  <div className="bg-white p-4 rounded-lg">
                    <QRCode value={setupData.provisioning_uri} size={180} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-muted-foreground">
                      Manual entry code
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2"
                      onClick={copySecretToClipboard}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <code className="block text-sm break-all">
                      {setupData.secret}
                    </code>
                  </div>
                </div>

                <Button
                  onClick={() => setStep(2)}
                  className="w-full group h-10"
                >
                  Continue to Verification
                  <ArrowRight
                    className="-me-1 ms-2 opacity-60 transition-transform group-hover:translate-x-0.5"
                    size={16}
                    strokeWidth={2}
                  />
                </Button>
              </>
            ) : (
              <div className="space-y-6">
                <InputOTP
                  value={verificationCode}
                  onChange={(value) => {
                    if (/^\d*$/.test(value)) {
                      setVerificationCode(value);
                    }
                  }}
                  maxLength={6}
                  containerClassName="group flex items-center justify-center has-[:disabled]:opacity-50"
                  inputMode="numeric"
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
                  onClick={handleVerify}
                  className="w-full h-11"
                  disabled={isLoading || verificationCode.length !== 6}
                >
                  {isLoading ? "Verifying..." : "Complete Setup"}
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center space-x-1.5 border-t p-4 bg-muted/10">
          {setupSteps.map((_, index) => (
            <div
              key={index}
              className={cn(
                "h-1.5 w-1.5 rounded-full transition-all",
                index === step ? "bg-primary w-2.5" : "bg-primary/20"
              )}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
