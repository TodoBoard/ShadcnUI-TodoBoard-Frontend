"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";

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

interface NavItem {
  title: string;
  url?: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
  }[];
  dialog?: boolean;
  dialogComponent?: (trigger: React.ReactNode) => React.ReactElement;
  shortcut?: string;
}

function LinkNavItem({ item }: { item: NavItem }) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        className={
          item.isActive ? "bg-sidebar-accent text-sidebar-primary" : undefined
        }
      >
        <a href={item.url}>
          {item.icon && (
            <item.icon
              className={`size-4 ${
                item.isActive ? "text-sidebar-primary" : "text-muted-foreground"
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
        </a>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function DialogNavItem({ item }: { item: NavItem }) {
  const triggerContent = (
    <SidebarMenuButton
      asChild
      className={
        item.isActive ? "bg-sidebar-accent text-sidebar-primary" : undefined
      }
    >
      <button type="button">
        {item.icon && (
          <item.icon
            className={`size-4 ${
              item.isActive ? "text-sidebar-primary" : "text-muted-foreground"
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
                  <a href={subItem.url}>
                    <span>{subItem.title}</span>
                  </a>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

export function NavMain({ items }: { items: NavItem[] }) {
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
            return <LinkNavItem key={item.title} item={item} />;
          }
          return null;
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
