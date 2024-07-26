import React from "react";
import Image from "next/image";

import avatarPlaceholder from "@/assets/avatar-placeholder.png";
import { cn } from "@/lib/utils";

interface UserAvatar {
  size?: number;
  className?: string;
  avatarUrl?: string | null;
}

const UserAvatar = ({ size, className, avatarUrl }: UserAvatar) => {
  return (
    <Image
      src={avatarUrl || avatarPlaceholder}
      alt="User avatar"
      width={size ?? 48}
      height={size ?? 48}
      className={cn(
        "aspect-square h-fit flex-none rounded-full bg-secondary object-cover",
        className,
      )}
    />
  );
};

export default UserAvatar;
