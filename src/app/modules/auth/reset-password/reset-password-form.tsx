"use client";

import * as React from "react";
import { CalendarCheck2, Eye, EyeOff, Check, X } from "lucide-react";
import { useState, useId, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Auth } from "@/lib/api";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import {
  PASSWORD_REQUIREMENTS,
  checkPasswordStrength,
  getStrengthColor,
} from "@/utils/password-utils";

type ResetStep = "check" | "password" | "otp";
type PasswordRequirement = { regex: RegExp; text: string };

const STEP_TITLES = {
  check: "Reset your password",
  password: "Set new password",
  otp: "Enter OTP-Code",
} as const;

export function PasswordResetForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const passwordId = useId();

  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<ResetStep>("check");
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [otpCode, setOtpCode] = useState("");

  const strength = useMemo(
    () => checkPasswordStrength(newPassword),
    [newPassword]
  );
  const strengthScore = useMemo(
    () => strength.filter((req) => req.met).length,
    [strength]
  );

  const handleCheckUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await Auth.checkPasswordReset(username);
      setStep("password");
      toast.success("Please set your new password");
    } catch (error) {
      toast.error(error as string);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (strengthScore < PASSWORD_REQUIREMENTS.length) {
      toast.error("Please meet all password requirements");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setStep("otp");
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otpCode.length !== 6) {
      toast.error("Please enter a valid 2FA code");
      return;
    }

    setIsLoading(true);
    try {
      await Auth.confirmPasswordReset({
        username,
        totp_code: otpCode,
        new_password: newPassword,
      });
      toast.success("Password reset successful!");
      router.push("/auth/login");
    } catch (error) {
      toast.error(error as string);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = {
    check: handleCheckUsername,
    password: handlePasswordSubmit,
    otp: handleResetPassword,
  }[step];

  const submitButtonText = isLoading
    ? { check: "Checking...", password: "Validating...", otp: "Resetting..." }[
        step
      ]
    : { check: "Continue", password: "Continue", otp: "Reset Password" }[step];

  const renderPasswordStrengthIndicator = () => (
    <div
      className="mt-3 h-1 w-full overflow-hidden rounded-full bg-border"
      role="progressbar"
      aria-valuenow={strengthScore}
      aria-valuemin={0}
      aria-valuemax={PASSWORD_REQUIREMENTS.length}
    >
      <div
        className={`h-full ${getStrengthColor(
          strengthScore
        )} transition-all duration-500 ease-out`}
        style={{
          width: `${(strengthScore / PASSWORD_REQUIREMENTS.length) * 100}%`,
        }}
      />
    </div>
  );

  const renderPasswordRequirements = () => (
    <ul className="space-y-1.5">
      {strength.map((req, index) => (
        <li key={index} className="flex items-center gap-2">
          {req.met ? (
            <Check size={16} className="text-emerald-500" />
          ) : (
            <X size={16} className="text-muted-foreground/80" />
          )}
          <span
            className={cn(
              "text-xs",
              req.met ? "text-emerald-600" : "text-muted-foreground"
            )}
          >
            {req.text}
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <a
              href="/"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-md">
                <CalendarCheck2 className="size-6 text-primary" />
              </div>
              <span className="sr-only">TodoBoard</span>
            </a>
            <h1 className="text-xl font-bold">{STEP_TITLES[step]}</h1>
            <div className="text-center text-sm">
              Remember your password?{" "}
              <a href="/auth/login" className="underline underline-offset-4">
                Sign in
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {step === "check" && (
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="johndoe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            )}

            {step === "password" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor={passwordId}>New Password</Label>
                  <div className="relative">
                    <Input
                      id={passwordId}
                      className="pe-9"
                      type={isPasswordVisible ? "text" : "password"}
                      placeholder="Enter your new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <button
                      className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center text-muted-foreground/80 hover:text-foreground"
                      type="button"
                      onClick={() => setIsPasswordVisible((prev) => !prev)}
                      aria-label={
                        isPasswordVisible ? "Hide password" : "Show password"
                      }
                      tabIndex={-1}
                    >
                      {isPasswordVisible ? (
                        <EyeOff size={16} strokeWidth={2} />
                      ) : (
                        <Eye size={16} strokeWidth={2} />
                      )}
                    </button>
                  </div>
                  {renderPasswordStrengthIndicator()}
                  {renderPasswordRequirements()}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      className="pe-9"
                      type={isConfirmPasswordVisible ? "text" : "password"}
                      placeholder="Confirm your new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <button
                      className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center text-muted-foreground/80 hover:text-foreground"
                      type="button"
                      onClick={() =>
                        setIsConfirmPasswordVisible((prev) => !prev)
                      }
                      aria-label={
                        isConfirmPasswordVisible
                          ? "Hide password"
                          : "Show password"
                      }
                      tabIndex={-1}
                    >
                      {isConfirmPasswordVisible ? (
                        <EyeOff size={16} strokeWidth={2} />
                      ) : (
                        <Eye size={16} strokeWidth={2} />
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}

            {step === "otp" && (
              <div className="space-y-4">
                <InputOTP
                  value={otpCode}
                  onChange={(value) => {
                    if (/^\d*$/.test(value)) {
                      setOtpCode(value);
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
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {submitButtonText}
            </Button>
          </div>
        </div>
      </form>

      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our{" "}
        <a href="/terms">Terms of Service</a> and{" "}
        <a href="/privacy">Privacy Policy</a>.
      </div>
    </div>
  );
}
