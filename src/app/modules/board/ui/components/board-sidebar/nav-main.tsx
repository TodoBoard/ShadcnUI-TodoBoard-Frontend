"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useSidebarMobileClose } from "@/hooks/use-sidebar-mobile-close";
import { mainNavItems, type NavigationItem } from "@/config/navigation";

interface NavItem extends NavigationItem {
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
  }[];
}

function LinkNavItem({ item }: { item: NavItem & { url: string } }) {
  const handleMobileItemClick = useSidebarMobileClose();

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        className={
          item.isActive ? "bg-sidebar-accent text-sidebar-primary" : undefined
        }
      >
        <Link href={item.url} onClick={handleMobileItemClick}>
          {item.icon && (
            <item.icon
              className={`size-4 ${item.isActive ? "text-sidebar-primary" : "text-muted-foreground"
                }`}
            />
          )}
          <span>{item.title}</span>
          {item.shortcut && (
            <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>
              {item.shortcut.replace("⌘", "")}
            </kbd>
          )}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function DialogNavItem({ item }: { item: NavItem }) {
  const handleMobileItemClick = useSidebarMobileClose();

  const triggerContent = (
    <SidebarMenuButton
      asChild
      className={
        item.isActive ? "bg-sidebar-accent text-sidebar-primary" : undefined
      }
    >
      <button type="button" onClick={handleMobileItemClick}>
        {item.icon && (
          <item.icon
            className={`size-4 ${item.isActive ? "text-sidebar-primary" : "text-muted-foreground"
              }`}
          />
        )}
        <span>{item.title}</span>
        {item.shortcut && (
          <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">⌘</span>
            {item.shortcut.replace("⌘", "")}
          </kbd>
        )}
      </button>
    </SidebarMenuButton>
  );

  if (item.dialogComponent) {
    return (
      <SidebarMenuItem>{item.dialogComponent(triggerContent)}</SidebarMenuItem>
    );
  }

  return <SidebarMenuItem>{triggerContent}</SidebarMenuItem>;
}

function CollapsibleNavItem({ item }: { item: NavItem }) {
  const handleMobileItemClick = useSidebarMobileClose();

  return (
    <Collapsible
      asChild
      defaultOpen={item.isActive}
      className="group/collapsible"
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={item.title}>
            {item.icon && <item.icon />}
            <span>{item.title}</span>
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.items?.map((subItem) => (
              <SidebarMenuSubItem key={subItem.title}>
                <SidebarMenuSubButton asChild>
                  <Link href={subItem.url} onClick={handleMobileItemClick}>
                    <span>{subItem.title}</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

export function NavMain({ items = mainNavItems }: { items?: NavItem[] }) {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          if (item.dialog) {
            return <DialogNavItem key={item.title} item={item} />;
          }
          if (item.items) {
            return <CollapsibleNavItem key={item.title} item={item} />;
          }
          if (item.url) {
            return (
              <LinkNavItem
                key={item.title}
                item={item as NavItem & { url: string }}
              />
            );
          }
          return null;
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
