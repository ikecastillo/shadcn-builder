"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuthState } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

export function SidebarUser() {
  const { subscriptionInfo } = useAuthState();
  const username = "Guest";
  const email = "guest@shadcn-builder";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="flex items-center gap-3 bg-white"
          disabled
        >
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src={undefined} alt={username} />
            <AvatarFallback className="rounded-lg">GB</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{username}</span>
            <span className="truncate text-xs text-muted-foreground">
              {email}
            </span>
          </div>
          <span
            className={cn(
              "text-xs px-1.5 py-0.5 rounded border bg-muted text-muted-foreground"
            )}
          >
            {(subscriptionInfo?.tier || "free").toUpperCase()}
          </span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
