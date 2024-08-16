import React from "react";
import Link from "next/link";
import { Bell, Bookmark, Home, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { validateRequest } from "@/utils/auth";
import prisma from "@/lib/prisma";
import NotificationsButton from "./NotificationsButton";

interface MenuBarPros {
  className?: string;
}

const MenuBar = async ({ className }: MenuBarPros) => {
  const { user } = await validateRequest();

  if (!user) {
    return null;
  }

  const unreadNotificationCount = await prisma.notification.count({
    where: {
      recipientId: user.id,
      read: false,
    },
  });

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
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Messages"
        asChild
      >
        <Link href="/messages">
          <Mail />
          <span className="hidden lg:inline">Messages</span>
        </Link>
      </Button>
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
