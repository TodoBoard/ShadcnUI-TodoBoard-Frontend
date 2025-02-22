import { HeroSection } from "@/app/modules/home/sections/hero";
import { ContactSection } from "@/app/modules/home/sections/contact";
import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://todoboard.net"),
  title: "TodoBoard - The Open Source Todo App",
  description:
    "TodoBoard is a powerful, user-friendly task management solution. Completly Open source, built with Next.js, TailwindCSS, Shadcn/UI, FastAPI, PostgreSQL.",
  keywords:
    "task management, project management, open source, kanban board, todo list, team collaboration, productivity tool, Next.js, TailwindCSS, Shadcn/UI, FastAPI, PostgreSQL",
  openGraph: {
    title: "TodoBoard - The Open Source Todo App",
    description:
      "TodoBoard is a powerful, user-friendly task management solution. Completly Open source, built with Next.js, TailwindCSS, Shadcn/UI, FastAPI, PostgreSQL.",
    type: "website",
    url: "https://todoboard.net",
    locale: "en_US",
    images: [
      {
        url: "/home/metadata_preview.png",
        width: 1200,
        height: 630,
        alt: "TodoBoard - Preview",
        type: "image/png",
      },
    ],
    siteName: "TodoBoard",
  },
  twitter: {
    card: "summary_large_image",
    site: "@todoboardnet",
    creator: "@todoboardnet",
    title: "TodoBoard - The Open Source Todo App",
    description:
      "TodoBoard is a powerful, user-friendly task management solution. Completly Open source, built with Next.js, TailwindCSS, Shadcn/UI, FastAPI, PostgreSQL.",
    images: [
      {
        url: "/home/metadata_preview.png",
        alt: "TodoBoard - Preview",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <ContactSection />
    </div>
  );
}
