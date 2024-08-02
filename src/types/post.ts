import { PostData } from "@/utils/prisma";

export interface PostsPage {
  posts: PostData[];
  nextCursor: string | null;
}
