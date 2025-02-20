import { LoginForm } from "@/app/modules/auth/login/login-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "TodoBoard | Login",
  description: "Login to your account",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
