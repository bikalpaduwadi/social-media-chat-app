"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Media } from "@prisma/client";
import { MessagesSquare } from "lucide-react";

import Linkify from "../Linkify";
import { cn } from "@/lib/utils";
import LikeButton from "./LikeButton";
import UserAvatar from "../UserAvatar";
import UserTooltip from "../UserTooltip";
import { PostData } from "@/utils/prisma";
import Comments from "../comments/Comments";
import BookmarkButton from "./BookmarkButton";
import { formatRelativeDate } from "@/utils/date";
import PostActionButton from "./PostActionButton";
import { useSession } from "@/app/(main)/SessionProvider";

interface PostProps {
  post: PostData;
}

const Post = (props: PostProps) => {
  const { post } = props;
  const { user } = useSession();
  const [showComments, setShowComments] = useState(false);

  return (
    <article className="group/post space-y-3 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          <Link href={`/users/${post.user?.username}`}>
            <UserAvatar avatarUrl={post.user?.avatarUrl} />
          </Link>
          <div>
            <UserTooltip user={post.user!}>
              <Link
                href={`/users/${post.user?.username}`}
                className="block font-medium hover:underline"
              >
                {post.user?.displayName}
              </Link>
            </UserTooltip>

            <Link
              href={`/posts/${post.id}`}
              className="block text-sm text-muted-foreground hover:underline"
              suppressHydrationWarning
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
      <Linkify>
        <div className="whitespace-pre-line break-words">{post.content}</div>
      </Linkify>
      {!!post.attachments.length && (
        <MediaPreviews attachments={post.attachments} />
      )}
      <hr className="text-muted-foreground" />
      <div className="flex justify-between gap-5">
        <div className="flex items-center gap-5">
          <LikeButton
            postId={post.id}
            initialState={{
              likes: post._count.likes,
              isLikedByUser: post.likes.some((like) => like.userId === user.id),
            }}
          />
          <CommentButton
            post={post}
            onClick={() => setShowComments(!showComments)}
          />
        </div>
        <BookmarkButton
          postId={post.id}
          initialState={{
            isBookmarkedByUser: post.bookmarks.some(
              (bookmark) => bookmark.userId === user.id,
            ),
          }}
        />
      </div>
      {showComments && <Comments post={post} />}
    </article>
  );
};

export default Post;

interface MediaPreviewProps {
  attachment: Media;
}

const MediaPreview = ({ attachment }: MediaPreviewProps) => {
  if (attachment.type === "IMAGE") {
    return (
      <Image
        src={attachment.url}
        alt="Attachment"
        width={500}
        height={500}
        className="mx-auto size-fit max-h-[30rem] rounded-2xl"
      />
    );
  }

  if (attachment.type === "VIDEO") {
    return (
      <div>
        <video
          src={attachment.url}
          controls
          className="mx-auto size-fit max-h-[30rem] rounded-2xl"
        />
      </div>
    );
  }

  return <p className="text-destructive">Unsupported media file</p>;
};

interface MediaPreviewsProps {
  attachments: Media[];
}

const MediaPreviews = ({ attachments }: MediaPreviewsProps) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        attachments.length > 1 && "sm:grid sm:grid-cols-2",
      )}
    >
      {attachments.map((attachment) => (
        <MediaPreview key={attachment.id} attachment={attachment} />
      ))}
    </div>
  );
};

interface CommentButtonProps {
  post: PostData;
  onClick: () => void;
}

const CommentButton = ({ post, onClick }: CommentButtonProps) => {
  return (
    <button className="flex items-center gap-3" onClick={onClick}>
      <MessagesSquare className="size-5" />
      <span className="text-sm font-medium tabular-nums">
        {post._count.comments}{" "}
        <span className="hidden sm:inline">{`Comment${post._count.comments > 1 ? "s" : ""}`}</span>
      </span>
    </button>
  );
};
