import { PasswordResetForm } from "@/app/modules/auth/reset-password/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <PasswordResetForm />
      </div>
    </div>
  );
}

