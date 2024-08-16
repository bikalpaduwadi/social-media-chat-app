import prisma from "@/lib/prisma";
import { NotificationPage } from "@/types/notification";
import { validateRequest } from "@/utils/auth";
import { notificationDataInclude } from "@/utils/prisma";
import { NextRequest } from "next/server";

const NOTIFICATIONS_PAGE_SIZE = 5;

export async function GET(req: NextRequest) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;

    const notifications = await prisma.notification.findMany({
      where: {
        recipientId: user.id,
      },
      include: notificationDataInclude,
      orderBy: { createdAt: "desc" },
      take: NOTIFICATIONS_PAGE_SIZE + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    const nextCursor =
      notifications.length > NOTIFICATIONS_PAGE_SIZE
        ? notifications[NOTIFICATIONS_PAGE_SIZE].id
        : null;

    const data: NotificationPage = {
      notifications: notifications.slice(0, NOTIFICATIONS_PAGE_SIZE),
      nextCursor,
    };

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
