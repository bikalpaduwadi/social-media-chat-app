"use client";

import React from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import kyInstance from "@/lib/ky";
import { Button } from "@/components/ui/button";
import { NotificationCountInfo } from "@/types/notification";

interface NotificationsButtonProps {
  initialState: NotificationCountInfo;
}

const NotificationsButton = ({ initialState }: NotificationsButtonProps) => {
  const { data } = useQuery({
    queryKey: ["unread-notification-count"],
    queryFn: () =>
      kyInstance
        .get("/api/notifications/unread-count")
        .json<NotificationCountInfo>(),
    initialData: initialState,
    refetchInterval: 60 * 1000,
  });
  return (
    <Button
      variant="ghost"
      title="Notifications"
      className="flex items-center justify-start gap-3"
      asChild
    >
      <Link href="/notifications">
        <div className="relative">
          <Bell />
          {!!data.unreadCount && (
            <span className="absolute -right-1 -top-1 rounded-full bg-primary px-1 text-xs font-medium tabular-nums text-primary-foreground">
              {data.unreadCount}
            </span>
          )}
        </div>
        <span className="hidden lg:inline">Notifications</span>
      </Link>
    </Button>
  );
};

export default NotificationsButton;
