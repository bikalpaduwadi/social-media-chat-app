import { NextRequest } from "next/server";

import prisma from "@/lib/prisma";
import { PostsPage } from "@/types/post";
import { validateRequest } from "@/utils/auth";
import { getPostDataInclude } from "@/utils/prisma";

const BOOKMARK_PAGE_SIZE = 5;

export async function GET(req: NextRequest) {
  try {
    const { user } = await validateRequest();

    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bookmarks = await prisma.bookmark.findMany({
      where: {
        userId: user.id,
      },
      include: {
        post: {
          include: getPostDataInclude(user.id),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: BOOKMARK_PAGE_SIZE + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    const nextCursor =
      bookmarks.length > BOOKMARK_PAGE_SIZE
        ? bookmarks[BOOKMARK_PAGE_SIZE].id
        : null;

    const data: PostsPage = {
      posts: bookmarks
        .slice(0, BOOKMARK_PAGE_SIZE)
        .map((bookmark) => bookmark.post),
      nextCursor,
    };

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
