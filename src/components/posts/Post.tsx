"use client";

import React from "react";
import Link from "next/link";

import UserAvatar from "../UserAvatar";
import { PostData } from "@/utils/prisma";
import { formatRelativeDate } from "@/utils/date";
import PostActionButton from "./PostActionButton";
import { useSession } from "@/app/(main)/SessionProvider";

interface PostProps {
  post: PostData;
}

const Post = (props: PostProps) => {
  const { post } = props;
  const { user } = useSession();

  return (
    <article className="group/post space-y-3 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          <Link href={`/users/${post.user?.username}`}>
            <UserAvatar avatarUrl={post.user?.avatarUrl} />
          </Link>
          <div>
            <Link
              href={`/users/${post.user?.username}`}
              className="block font-medium hover:underline"
            >
              {post.user?.displayName}
            </Link>
            <Link
              href={`/posts/${post.id}`}
              className="block text-sm text-muted-foreground hover:underline"
            >
              {formatRelativeDate(post.createdAt)}
            </Link>
          </div>
        </div>
        {post.user?.id === user.id && (
          <PostActionButton
            post={post}
            className="opacity-0 transition-opacity group-hover/post:opacity-100"
          />
        )}
      </div>
      <div className="whitespace-pre-line break-words">{post.content}</div>
    </article>
  );
};

export default Post;
