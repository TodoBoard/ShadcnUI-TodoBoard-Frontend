"use client";

import { CalendarCheck2, Eye, EyeOff, Check, X } from "lucide-react";
import { useState, useId, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Auth, handleApiError } from "@/lib/api";
import type { RegisterFormData } from "@/models/auth";
import {
  PASSWORD_REQUIREMENTS,
  checkPasswordStrength,
  getStrengthColor,
} from "@/utils/password-utils";
import Link from "next/link";

export function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = useId();
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [formData, setFormData] = useState<RegisterFormData>({
    username: "",
    password: "",
  });

  const toggleVisibility = () => setIsVisible((prev) => !prev);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const strength = checkPasswordStrength(formData.password);
  const strengthScore = useMemo(() => {
    return strength.filter((req) => req.met).length;
  }, [strength]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (strengthScore < PASSWORD_REQUIREMENTS.length) {
      toast.error("Please meet all password requirements");
      return;
    }

    setIsLoading(true);
    try {
      await Auth.register(formData);
      toast.success("Registration successful!");

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
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <Link
              href="/"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-md">
                <CalendarCheck2 className="size-6 text-primary" />
              </div>
              <span className="sr-only">TodoBoard</span>
            </Link>
            <h1 className="text-xl font-bold">Create your account</h1>
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/auth/login" className="underline underline-offset-4">
                Sign in
              </Link>
            </div>
          </div>
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
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor={id}>Password</Label>
              </div>
              <div className="relative">
                <Input
                  id={id}
                  name="password"
                  className="pe-9"
                  placeholder="Enter your password"
                  type={isVisible ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  aria-invalid={strengthScore < PASSWORD_REQUIREMENTS.length}
                  required
                />
                <button
                  className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center text-muted-foreground/80 hover:text-foreground"
                  type="button"
                  onClick={toggleVisibility}
                >
                  {isVisible ? (
                    <EyeOff size={16} strokeWidth={2} />
                  ) : (
                    <Eye size={16} strokeWidth={2} />
                  )}
                </button>
              </div>
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
                    width: `${
                      (strengthScore / PASSWORD_REQUIREMENTS.length) * 100
                    }%`,
                  }}
                ></div>
              </div>
              <ul className="space-y-1.5">
                {strength.map((req, index) => (
                  <li key={index} className="flex items-center gap-2">
                    {req.met ? (
                      <Check size={16} className="text-emerald-500" />
                    ) : (
                      <X size={16} className="text-muted-foreground/80" />
                    )}
                    <span
                      className={`text-xs ${
                        req.met ? "text-emerald-600" : "text-muted-foreground"
                      }`}
                    >
                      {req.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </div>
        </div>
      </form>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>
      </div>
    </div>
  );
}
