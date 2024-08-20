"use server";

import prisma from "@/lib/prisma";
import streamServerClient from "@/lib/stream";
import { validateRequest } from "@/utils/auth";
import { getUserDataSelect } from "@/utils/prisma";
import {
  updateUserProfileSchema,
  UpdateUserProfileValues,
} from "@/utils/validator";

export async function updateUserProfile(values: UpdateUserProfileValues) {
  const validateValues = updateUserProfileSchema.parse(values);

  const { user } = await validateRequest();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const updatedUser = await prisma.$transaction(async (transaction) => {
    const updatedUser = await transaction.user.update({
      where: { id: user.id },
      data: validateValues,
      select: getUserDataSelect(user.id),
    });

    await streamServerClient.partialUpdateUser({
      id: user.id,
      set: {
        name: validateValues.displayName,
      },
    });

    return updatedUser;
  });

  return updatedUser;
}
