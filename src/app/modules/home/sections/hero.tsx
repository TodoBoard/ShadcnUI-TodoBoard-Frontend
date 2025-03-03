"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight, GithubIcon } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";

export const HeroSection = () => {
  const { theme } = useTheme();
  return (
    <section className="homepage-container w-full">
      <div className="grid place-items-center lg:max-w-screen-xl gap-8 mx-auto py-10 md:py-15">
        <div className="text-center space-y-8">
          <div className="flex justify-center">
            <Link
              href="https://github.com/todoboard"
              target="_blank"
              className={cn(
                "group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800"
              )}
            >
              <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
                <span>💜 Source code on Github</span>
                <ArrowRight className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
              </AnimatedShinyText>
            </Link>
          </div>

          <div className="max-w-screen-md mx-auto text-center text-4xl md:text-6xl font-bold">
            <h1 className="text-5xl md:text-7xl font-extrabold">
              <span className="relative">
                <span className="text-gradient bg-gradient-to-r from-[#D247BF] to-primary bg-clip-text">
                  TodoBoard
                </span>
                <svg
                  className="absolute -bottom-2 w-full left-0"
                  viewBox="0 0 200 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 5.5C47.6667 2.16667 154.4 -2.4 199 6"
                    stroke="url(#paint0_linear)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear"
                      x1="1"
                      y1="5"
                      x2="199"
                      y2="5"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#D247BF" />
                      <stop offset="1" stopColor="#7C3AED" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
              <span className="block text-4xl md:text-6xl font-normal mt-4">
                the Open Source Todo App
              </span>
            </h1>
          </div>

          <p className="max-w-screen-sm mx-auto text-xl text-muted-foreground">
            {`Full-Stack Todo App with Next.js, Tailwind CSS, TypeScript, Shadcn UI, FastAPI, and PostgreSQL. Many features like 2FA, PWA and more.`}
          </p>

          <div className="space-y-4 md:space-y-0 md:space-x-4 flex flex-col md:flex-row justify-center items-center">
            <Link
              aria-label="Try it out"
              href="/auth/login"
              className="w-5/6 md:w-1/4"
            >
              <Button className="w-full font-bold group/arrow rounded-xl bg-primary hover:bg-primary/90">
                <span className="flex items-center gap-2">
                  Try it out
                  <ArrowRight className="size-5 ml-2 group-hover/arrow:translate-x-1 transition-transform" />
                </span>
              </Button>
            </Link>
            <Link
              aria-label="GitHub"
              href="https://github.com/TodoBoard"
              target="_blank"
              className="w-5/6 md:w-1/4"
            >
              <Button
                variant="outline"
                className="w-full font-bold group/arrow rounded-xl border-2 hover:bg-neutral-100 dark:hover:bg-neutral-900"
              >
                <span className="flex items-center">
                  <GithubIcon className="mr-2 size-5" />
                  GitHub
                </span>
              </Button>
            </Link>
          </div>
        </div>

        <div className="relative group mt-14">
          <div className="absolute top-2 lg:-top-8 left-1/2 transform -translate-x-1/2 w-[90%] mx-auto h-24 lg:h-80 bg-primary/50 rounded-full blur-3xl"></div>
          <Image
            width={1200}
            height={1200}
            className="w-full md:w-[1200px] mx-auto rounded-lg relative leading-none flex items-center border border-primary/30"
            src={
              theme === "light"
                ? "/home/light_board.png"
                : "/home/dark_board.png"
            }
            alt="dashboard"
          />

          <div className="absolute bottom-0 left-0 w-full h-20 md:h-28 bg-gradient-to-b from-background/0 via-background/50 to-background rounded-lg"></div>
        </div>
      </div>
    </section>
  );
};
