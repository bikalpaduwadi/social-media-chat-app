import { NextRequest } from "next/server";

import prisma from "@/lib/prisma";
import { PostsPage } from "@/types/post";
import { validateRequest } from "@/utils/auth";
import { getPostDataInclude } from "@/utils/prisma";

const POST_PAGE_SIZE = 5;

export async function GET(req: NextRequest) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;

    const posts = await prisma.post.findMany({
      where: {
        user: {
          followers: {
            some: {
              followerId: user.id,
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: POST_PAGE_SIZE + 1,
      cursor: cursor ? { id: cursor } : undefined,
      include: getPostDataInclude(user.id),
    });

    const nextCursor =
      posts.length > POST_PAGE_SIZE ? posts[POST_PAGE_SIZE].id : null;

    const data: PostsPage = {
      posts: posts.slice(0, POST_PAGE_SIZE),
      nextCursor,
    };

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
