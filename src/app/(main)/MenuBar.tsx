import React from "react";
import Link from "next/link";
import { Bell, Bookmark, Home, Mail } from "lucide-react";

import prisma from "@/lib/prisma";
import MessagesButton from "./MessagesButton";
import streamServerClient from "@/lib/stream";
import { validateRequest } from "@/utils/auth";
import { Button } from "@/components/ui/button";
import NotificationsButton from "./NotificationsButton";

interface MenuBarPros {
  className?: string;
}

const MenuBar = async ({ className }: MenuBarPros) => {
  const { user } = await validateRequest();

  if (!user) {
    return null;
  }

  const [unreadNotificationCount, unreadMessageCount] = await Promise.all([
    prisma.notification.count({
      where: {
        recipientId: user.id,
        read: false,
      },
    }),
    (await streamServerClient.getUnreadCount(user.id)).total_unread_count,
  ]);

  return (
    <div className={className}>
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Home"
        asChild
      >
        <Link href="/">
          <Home />
          <span className="hidden lg:inline">Home</span>
        </Link>
      </Button>
      <NotificationsButton
        initialState={{ unreadCount: unreadNotificationCount }}
      />

      <MessagesButton initialState={{ unreadCount: unreadMessageCount }} />
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Bookbarks"
        asChild
      >
        <Link href="/bookmarks">
          <Bookmark />
          <span className="hidden lg:inline">Bookbarks</span>
        </Link>
      </Button>
    </div>
  );
};

export default MenuBar;
