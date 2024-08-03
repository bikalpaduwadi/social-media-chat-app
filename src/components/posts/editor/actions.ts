"use server";

import prisma from "@/lib/prisma";
import { validateRequest } from "@/utils/auth";
import { getPostDataInclude } from "@/utils/prisma";
import { createPostSchema } from "@/utils/validator";

export async function submitPost(input: string) {
  const { user } = await validateRequest();

  if (!user) {
    throw Error("Unauthorized");
  }

  const { content } = createPostSchema.parse({ content: input });

  const newPost = await prisma.post.create({
    data: {
      content,
      userId: user.id,
    },

    include: getPostDataInclude(user.id),
  });

  return newPost;
}
