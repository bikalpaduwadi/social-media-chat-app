import { UploadThingError, UTApi } from "uploadthing/server";
import { createUploadthing, FileRouter } from "uploadthing/next";

import prisma from "@/lib/prisma";
import streamServerClient from "@/lib/stream";
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
      const oldAvatarUrl = metadata.user.avatarUrl;

      if (oldAvatarUrl) {
        const key = oldAvatarUrl.split(
          `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
        )[1];

        await new UTApi().deleteFiles(key);
      }

      const updatedAvatarUrl = file.url.replace(
        "/f/",
        `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
      );

      await Promise.all([
        prisma.user.update({
          where: { id: metadata.user.id },
          data: {
            avatarUrl: updatedAvatarUrl,
          },
        }),

        streamServerClient.partialUpdateUser({
          id: metadata.user.id,
          set: {
            image: updatedAvatarUrl,
          },
        }),
      ]);

      return { avatarUrl: updatedAvatarUrl };
    }),
  attachment: uploader({
    image: { maxFileSize: "4MB", maxFileCount: 5 },
    video: { maxFileSize: "64MB", maxFileCount: 5 },
  })
    .middleware(async () => {
      const { user } = await validateRequest();

      if (!user) {
        throw new UploadThingError("Unauthorized");
      }

      return {};
    })
    .onUploadComplete(async ({ file }) => {
      const media = await prisma.media.create({
        data: {
          url: file.url.replace(
            "/f/",
            `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
          ),
          type: file.type.startsWith("image") ? "IMAGE" : "VIDEO",
        },
      });

      return { mediaId: media.id };
    }),
} satisfies FileRouter;

export type AppFileRouter = typeof fileRouter;
