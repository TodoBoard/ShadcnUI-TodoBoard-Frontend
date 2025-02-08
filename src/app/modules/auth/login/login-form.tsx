"use client";

import { CalendarCheck2, Eye, EyeOff } from "lucide-react";
import { useState, useId } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const id = useId();
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const toggleVisibility = () => setIsVisible((prev) => !prev);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <a
              href="/"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-md">
                <CalendarCheck2 className="size-6 text-primary" />
              </div>
              <span className="sr-only">TodoApp</span>
            </a>
            <h1 className="text-xl font-bold">Welcome to TodoApp</h1>
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="/auth/register" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" type="text" placeholder="johndoe" required />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor={id}>Password</Label>
                <a
                  href="/auth/reset-password"
                  className="text-sm text-muted-foreground hover:text-primary underline underline-offset-4"
                >
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <Input
                  id={id}
                  className="pe-9"
                  placeholder="Enter your password"
                  type={isVisible ? "text" : "password"}
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
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </div>
          <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
            By clicking continue, you agree to our{" "}
            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </div>
        </div>
      </form>
    </div>
  );
}
