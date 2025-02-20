import { Suspense } from "react";
import { RegisterForm } from "@/app/modules/auth/register/register-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "TodoBoard | Register",
  description: "Register to your account",
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Suspense>
          <RegisterForm />
        </Suspense>
      </div>
    </div>
  );
}
