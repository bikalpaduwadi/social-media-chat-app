import { UploadThingError } from "uploadthing/server";
import { createUploadthing, FileRouter } from "uploadthing/next";

import prisma from "@/lib/prisma";
import { validateRequest } from "@/utils/auth";

const uploader = createUploadthing();

export const fileRouter = {
  avatar: uploader({
    image: { maxFileSize: "512KB" },
  })
    .middleware(async () => {
      const { user } = await validateRequest();

      if (!user) {
        throw new UploadThingError("Unauthorized");
      }

      return { user };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const updatedAvatarUrl = file.url.replace(
        "/f/",
        `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}`,
      );

      await prisma.user.update({
        where: { id: metadata.user.id },
        data: {
          avatarUrl: updatedAvatarUrl,
        },
      });

      return { avatarUrl: updatedAvatarUrl };
    }),
} satisfies FileRouter;

export type AppFileRouter = typeof fileRouter;
