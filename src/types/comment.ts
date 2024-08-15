import { CommentData } from "@/utils/prisma";

export interface CommentsPage {
  comments: CommentData[];
  previousCursor: string | null;
}
