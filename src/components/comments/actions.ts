"use server";

import prisma from "@/lib/prisma";
import { validateRequest } from "@/utils/auth";
import { createCommentSchema } from "@/utils/validator";
import { getCommentDataInclude, PostData } from "@/utils/prisma";

export async function crateComment({
  post,
  content,
}: {
  post: PostData;
  content: string;
}) {
  const { user } = await validateRequest();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { content: validatedContent } = createCommentSchema.parse({ content });

  const [newComment] = await prisma.$transaction([
    prisma.comment.create({
      data: {
        content: validatedContent,
        postId: post.id,
        userId: user.id,
      },
      include: getCommentDataInclude(user.id),
    }),
    ...(post.user?.id !== user.id
      ? [
          prisma.notification.create({
            data: {
              issuerId: user.id,
              recipientId: post.userId,
              type: "COMMENT",
              postId: post.id,
            },
          }),
        ]
      : []),
  ]);

  return newComment;
}

export async function deleteComment(id: string) {
  const { user } = await validateRequest();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const comment = await prisma.comment.findUnique({
    where: { id },
  });

  if (!comment) {
    throw new Error("Comment not found");
  }

  if (comment.userId !== user.id) {
    throw new Error("Unauthorized");
  }

  const deletedComment = await prisma.comment.delete({
    where: { id },
    include: getCommentDataInclude(user.id),
  });

  return deletedComment;
}
