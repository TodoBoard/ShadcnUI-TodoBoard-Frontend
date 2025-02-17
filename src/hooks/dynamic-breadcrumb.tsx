"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import React from "react";

const decodeUrlSafeName = (segment: string) => {
  if (segment.includes("-id=")) {
    segment = segment.split("-id=")[0];
  }
  return segment
    .replace(/-percent-/g, " ")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

export const DynamicBreadcrumb = () => {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const renderBreadcrumbItem = (
    segment: string,
    path: string,
    isLast: boolean
  ) => {
    let content = segment;
    if (segment.includes("-id=")) {
      content = segment.split("-id=")[0];
    }

    content = decodeUrlSafeName(content);
    content = content
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return (
      <BreadcrumbItem>
        {isLast ? (
          <BreadcrumbPage>{content}</BreadcrumbPage>
        ) : (
          <Link href={path} legacyBehavior passHref>
            <BreadcrumbLink>{content}</BreadcrumbLink>
          </Link>
        )}
      </BreadcrumbItem>
    );
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          {pathname === "/board" ? (
            <BreadcrumbPage>
              <Home size={16} strokeWidth={2} aria-hidden="true" />
              <span className="sr-only">Home</span>
            </BreadcrumbPage>
          ) : (
            <Link href="/board/home" legacyBehavior passHref>
              <BreadcrumbLink>
                <Home size={16} strokeWidth={2} aria-hidden="true" />
                <span className="sr-only">Home</span>
              </BreadcrumbLink>
            </Link>
          )}
        </BreadcrumbItem>

        {segments.map((segment, index) => {
          if (segment === "board" || segment === "projects") return null;
          const path = `/${segments.slice(0, index + 1).join("/")}`;
          const isLast = index === segments.length - 1;

          return (
            <React.Fragment key={path}>
              <BreadcrumbSeparator />
              {renderBreadcrumbItem(segment, path, isLast)}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
