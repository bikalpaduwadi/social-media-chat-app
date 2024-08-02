"use server";

import prisma from "@/lib/prisma";
import { validateRequest } from "@/utils/auth";
import { createPostSchema } from "@/utils/validator";

export async function submitPost(input: string) {
  const { user } = await validateRequest();

  if (!user) {
    throw Error("Unauthorized");
  }

  const { content } = createPostSchema.parse({ content: input });

  await prisma.post.create({
    data: {
      content,
      userId: user.id,
    },
  });
}
