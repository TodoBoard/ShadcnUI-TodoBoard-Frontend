"use client";

import { CalendarCheck2, Eye, EyeOff } from "lucide-react";
import { useState, useId } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Auth, handleApiError } from "@/lib/api";
import type { LoginFormData } from "@/models/auth";
import Link from "next/link";

interface LoginFormProps extends React.ComponentPropsWithoutRef<"div"> {
  className?: string;
}

export function LoginForm({ className, ...props }: LoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const passwordId = useId();

  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
    remember_me: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await Auth.login(formData);
      toast.success("Login successful!");

      const redirectTo = searchParams.get("redirect") || "/board/home";
      router.push(redirectTo);
      router.refresh();
    } catch (error: unknown) {
      toast.error(handleApiError(error, true));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <header className="flex flex-col items-center gap-2">
          <Link href="/" className="flex flex-col items-center gap-2 font-medium">
            <div className="flex h-8 w-8 items-center justify-center rounded-md">
              <CalendarCheck2 className="size-6 text-primary" />
            </div>
            <span className="sr-only">TodoBoard</span>
          </Link>
          <h1 className="text-xl font-bold">Welcome to TodoBoard</h1>
          <p className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link
              href={`/auth/register${
                searchParams.get("redirect")
                  ? `?redirect=${searchParams.get("redirect")}`
                  : ""
              }`}
              className="underline underline-offset-4"
            >
              Sign up
            </Link>
          </p>
        </header>

        <div className="flex flex-col gap-6">
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="johndoe"
              value={formData.username}
              onChange={handleInputChange}
              required
              autoComplete="username"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor={passwordId}>Password</Label>
              <Link
                href="/auth/reset-password"
                className="text-sm text-muted-foreground hover:text-primary underline underline-offset-4"
                tabIndex={-1}
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id={passwordId}
                name="password"
                className="pe-9"
                placeholder="Enter your password"
                type={isPasswordVisible ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                required
                autoComplete="current-password"
              />
              <button
                className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center text-muted-foreground/80 hover:text-foreground"
                type="button"
                onClick={() => setIsPasswordVisible((prev) => !prev)}
                aria-label={
                  isPasswordVisible ? "Hide password" : "Show password"
                }
              >
                {isPasswordVisible ? (
                  <EyeOff size={16} strokeWidth={2} />
                ) : (
                  <Eye size={16} strokeWidth={2} />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-2">
            <Switch
              id="remember_me"
              checked={formData.remember_me}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, remember_me: checked }))
              }
            />
            <Label
              htmlFor="remember_me"
              className="text-sm font-normal text-muted-foreground"
            >
              Remember me
            </Label>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </div>

        <footer className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
          By clicking continue, you agree to our{" "}
          <a href="/terms">Terms of Service</a> and{" "}
          <a href="/privacy">Privacy Policy</a>.
        </footer>
      </form>
    </div>
  );
}
