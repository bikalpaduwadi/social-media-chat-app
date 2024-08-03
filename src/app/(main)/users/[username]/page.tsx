import { Metadata } from "next";
import React, { cache } from "react";
import { formatDate } from "date-fns";

import prisma from "@/lib/prisma";
import UserPosts from "./UserPosts";
import { notFound } from "next/navigation";
import { FollowerInfo } from "@/types/user";
import { formatNumber } from "@/utils/misc";
import { validateRequest } from "@/utils/auth";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/UserAvatar";
import TrendSidebar from "@/components/TrendSidebar";
import FollowButton from "@/components/FollowButton";
import FollowerCounts from "@/components/FollowerCounts";
import { getUserDataSelect, UserData } from "@/utils/prisma";

interface PageProps {
  params: { username: string };
}

const getUser = cache(async (username: string, loggedInUserId: string) => {
  const user = await prisma.user.findFirst({
    where: {
      username: {
        equals: username,
        mode: "insensitive",
      },
    },
    select: getUserDataSelect(loggedInUserId),
  });

  if (!user) {
    notFound();
  }

  return user;
});

export async function generateMetadata({
  params: { username },
}: PageProps): Promise<Metadata> {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) {
    return {};
  }

  const user = await getUser(username, loggedInUser.id);

  return {
    title: `${user.displayName} (@${user.username})`,
  };
}

const page = async ({ params: { username } }: PageProps) => {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) {
    return (
      <p className="text-destructive">
        Not authorized. Please sign in to view this page.
      </p>
    );
  }

  const user = await getUser(username, loggedInUser.id);

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <UserProfile user={user} loggedInUserId={loggedInUser.id} />
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h2 className="text-center text-2xl font-bold">
            {user.displayName}&apos;s posts
          </h2>
        </div>
        <UserPosts userId={user.id} />
      </div>
      <TrendSidebar />
    </main>
  );
};

export default page;

interface UserProfileProps {
  user: UserData;
  loggedInUserId: string;
}

const UserProfile = async (props: UserProfileProps) => {
  const { user, loggedInUserId } = props;

  const followerInfo: FollowerInfo = {
    followers: user._count.followers,
    isFollowedByUser: user.followers.some(
      ({ followerId }) => followerId === loggedInUserId,
    ),
  };

  return (
    <div className="h-fit w-full space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <UserAvatar
        avatarUrl={user.avatarUrl}
        size={250}
        className="rounded-full\\ mx-auto size-full max-h-60 min-w-60"
      />
      <div className="flex flex-wrap gap-3 sm:flex-nowrap">
        <div className="me-auto space-y-3">
          <div>
            <h1 className="text-3xl font-bold">{user.displayName}</h1>
            <div className="text-muted-foreground">@{user.username}</div>
          </div>
          <div>Member since {formatDate(user.createdAt, "MMM d, yyyy")}</div>
          <div className="flex items-center gap-3">
            <span>
              Posts:{" "}
              <span className="font-semibold">
                {formatNumber(user._count.posts)}
              </span>
            </span>
            <FollowerCounts userId={user.id} initialState={followerInfo} />
          </div>
        </div>
        {user.id === loggedInUserId ? (
          <Button>Edit profile</Button>
        ) : (
          <FollowButton userId={user.id} initialState={followerInfo} />
        )}
      </div>
      {user.bio && (
        <>
          <hr />
          <div className="overflow-hidden whitespace-pre-line break-words">
            {user.bio}
          </div>
        </>
      )}
    </div>
  );
};
