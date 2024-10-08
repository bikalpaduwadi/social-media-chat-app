import Link from "next/link";
import { Loader2 } from "lucide-react";
import React, { Suspense } from "react";
import { unstable_cache } from "next/cache";

import prisma from "@/lib/prisma";
import UserAvatar from "./UserAvatar";
import FollowButton from "./FollowButton";
import { formatNumber } from "@/utils/misc";
import { validateRequest } from "@/utils/auth";
import { getUserDataSelect } from "@/utils/prisma";
import UserTooltip from "./UserTooltip";

const TrendSidebar = () => {
  return (
    <div className="sticky top-[5.25rem] hidden h-fit w-72 flex-none space-y-5 md:block lg:w-80">
      <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
        <WhoToFollow />
        <TrendingTopics />
      </Suspense>
    </div>
  );
};

export default TrendSidebar;

const WhoToFollow = async () => {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) {
    return null;
  }

  const usersToFollow = await prisma.user.findMany({
    where: {
      NOT: {
        id: loggedInUser.id,
      },
      followers: {
        none: {
          followerId: loggedInUser.id,
        },
      },
    },
    select: getUserDataSelect(loggedInUser.id),
    take: 5,
  });

  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="text-xl font-bold">Who to follow</div>
      {usersToFollow.map((user) => (
        <div key={user.id} className="flex items-center justify-between gap-3">
          <UserTooltip user={user}>
            <Link
              href={`/users/${user.username}`}
              className="flex items-center gap-3"
            >
              <UserAvatar avatarUrl={user.avatarUrl} className="flex-none" />
              <div>
                <p className="line-clamp-1 break-all font-semibold hover:underline">
                  {user.displayName}
                </p>
                <p className="line-clamp-1 break-all text-muted-foreground">
                  @{user.username}
                </p>
              </div>
            </Link>
          </UserTooltip>
          <FollowButton
            userId={user.id}
            initialState={{
              followers: user._count.followers,
              isFollowedByUser: !!user.followers.some(
                (follower) => follower.followerId === loggedInUser.id,
              ),
            }}
          />
        </div>
      ))}
    </div>
  );
};

// This will only cache the data in prod env
const getTrendingTopics = unstable_cache(
  async () => {
    const result = await prisma.$queryRaw<{ hashtag: string; count: bigint }[]>`
      SELECT LOWER(unnest(regexp_matches(content, '#[[:alnum:]_]+', 'g'))) AS hashtag, COUNT(*) AS count
      FROM posts
      GROUP BY (hashtag)
      ORDER BY count DESC, hashtag ASC
      LIMIT 5
    `;

    return result.map((row) => ({
      hashtag: row.hashtag,
      count: Number(row.count),
    }));
  },
  ["TRENDING_TOPICS"],
  {
    revalidate: 3 * 60 * 60,
  },
);

const TrendingTopics = async () => {
  const trendingTopics = await getTrendingTopics();

  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="text-xl font-bold">Trending topics</div>
      {trendingTopics.map(({ hashtag, count }) => {
        const title = hashtag.split("#")[1];

        return (
          <Link key={title} href={`/hashtag/${title}`} className="block">
            <p
              className="line-clamp-1 break-all font-semibold hover:underline"
              title={hashtag}
            >
              {hashtag}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatNumber(count)} {count === 1 ? "post" : "posts"}
            </p>
          </Link>
        );
      })}
    </div>
  );
};
