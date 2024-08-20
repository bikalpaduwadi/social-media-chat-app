import streamServerClient from "@/lib/stream";
import { validateRequest } from "@/utils/auth";

export async function GET() {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const expirationTime = Math.floor(Date.now() / 1000) + 60 * 60;
    const issuedAt = Math.floor(Date.now() / 1000) - 60;

    const token = streamServerClient.createToken(
      user.id,
      expirationTime,
      issuedAt,
    );

    // await streamServerClient.upsertUser({
    //   id: user.id,
    //   username: user.username,
    //   name: user.displayName,
    //   image: user.avatarUrl,
    // });
    return Response.json({ token });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
