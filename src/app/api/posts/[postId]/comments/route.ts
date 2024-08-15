import { NextRequest } from "next/server";

import prisma from "@/lib/prisma";
import { CommentsPage } from "@/types/comment";
import { validateRequest } from "@/utils/auth";
import { getCommentDataInclude } from "@/utils/prisma";

const COMMENTS_PAGE_SIZE = 5;

export async function GET(
  req: NextRequest,
  { params: { postId } }: { params: { postId: string } },
) {
  try {
    const { user } = await validateRequest();

    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const comments = await prisma.comment.findMany({
      where: {
        postId,
      },
      include: getCommentDataInclude(user.id),
      orderBy: { createdAt: "asc" },
      take: -COMMENTS_PAGE_SIZE - 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    const previousCursor =
      comments.length > COMMENTS_PAGE_SIZE ? comments[0].id : null;

    const data: CommentsPage = {
      comments:
        comments.length > COMMENTS_PAGE_SIZE ? comments.slice(1) : comments,
      previousCursor,
    };

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
