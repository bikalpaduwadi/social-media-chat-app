"use server";

import { cookies } from "next/headers";
import { verify } from "@node-rs/argon2";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect";

import prisma from "@/lib/prisma";
import { lucia } from "@/utils/auth";
import { LoginValues, loginSchema } from "@/utils/validator";

export async function login(
  credentials: LoginValues,
): Promise<{ error: string }> {
  try {
    const { username, password } = loginSchema.parse(credentials);

    const existingUser = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
    });

    if (!existingUser || !existingUser.passwordHash) {
      return {
        error: "Incorrect username or password",
      };
    }

    const isValidPassword = await verify(existingUser.passwordHash, password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    if (!isValidPassword) {
      return {
        error: "Incorrect username or password",
      };
    }

    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    return redirect("/");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    console.log(error);
    return {
      error: "Something went wrong",
    };
  }
}
