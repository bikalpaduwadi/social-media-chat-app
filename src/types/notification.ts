import { NotificationData } from "@/utils/prisma";

export interface NotificationPage {
  notifications: NotificationData[];
  nextCursor: string | null;
}

export interface NotificationCountInfo {
  unreadCount: number;
}
