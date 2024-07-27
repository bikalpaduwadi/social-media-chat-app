import React from "react";
import Link from "next/link";
import { Bell, Bookmark, Home, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";

interface MenuBarPros {
  className?: string;
}

const MenuBar = ({ className }: MenuBarPros) => {
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
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Notifications"
        asChild
      >
        <Link href="/notifications">
          <Bell />
          <span className="hidden lg:inline">Notifications</span>
        </Link>
      </Button>
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
