import { Prisma } from "@prisma/client";
import { TypeOf } from "zod";

// export const userDataSelect = {
//   id: true,
//   username: true,
//   displayName: true,
//   avatarUrl: true,
// } satisfies Prisma.UserSelect;

export const getUserDataSelect = (loggedInUserId: string) => {
  return {
    id: true,
    username: true,
    displayName: true,
    avatarUrl: true,
    bio: true,
    createdAt: true,
    followers: {
      where: {
        followerId: loggedInUserId,
      },
      select: {
        followerId: true,
      },
    },
    _count: {
      select: {
        followers: true,
        posts: true,
      },
    },
  } satisfies Prisma.UserSelect;
};

export type UserData = Prisma.UserGetPayload<{
  select: ReturnType<typeof getUserDataSelect>;
}>;

export const getPostDataInclude = (loggedInUserId: string) => {
  return {
    user: {
      select: getUserDataSelect(loggedInUserId),
    },
    attachments: true,
    likes: {
      where: {
        userId: loggedInUserId,
      },
      select: {
        userId: true,
      },
    },
    bookmarks: {
      where: {
        userId: loggedInUserId,
      },
      select: {
        userId: true,
      },
    },
    _count: {
      select: {
        likes: true,
        comments: true,
      },
    },
  } satisfies Prisma.PostInclude;
};

export type PostData = Prisma.PostGetPayload<{
  include: ReturnType<typeof getPostDataInclude>;
}>;

export const getCommentDataInclude = (loggedInUserId: string) => {
  return {
    user: {
      select: getUserDataSelect(loggedInUserId),
    },
  } satisfies Prisma.CommentInclude;
};

export type CommentData = Prisma.CommentGetPayload<{
  include: ReturnType<typeof getCommentDataInclude>;
}>;

export const notificationDataInclude = {
  issuer: {
    select: {
      username: true,
      displayName: true,
      avatarUrl: true,
    },
  },
  post: {
    select: {
      content: true,
    },
  },
} satisfies Prisma.NotificationInclude;

export type NotificationData = Prisma.NotificationGetPayload<{
  include: typeof notificationDataInclude;
}>;
