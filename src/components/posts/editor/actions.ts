"use server";

import prisma from "@/lib/prisma";
import { validateRequest } from "@/utils/auth";
import { getPostDataInclude } from "@/utils/prisma";
import { createPostSchema } from "@/utils/validator";

export async function submitPost(input: {
  content: string;
  mediaIds: string[];
}) {
  const { user } = await validateRequest();

  if (!user) {
    throw Error("Unauthorized");
  }

  const { content, mediaIds } = createPostSchema.parse(input);

  const newPost = await prisma.post.create({
    data: {
      content,
      userId: user.id,
      attachments: {
        connect: mediaIds.map((id) => ({ id })),
      },
    },

    include: getPostDataInclude(user.id),
  });

  return newPost;
}
