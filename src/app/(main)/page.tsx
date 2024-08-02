import prisma from "@/lib/prisma";
import Post from "@/components/posts/Post";
import { postDataInclude } from "@/utils/prisma";
import TrendSidebar from "@/components/TrendSidebar";
import PostEditor from "@/components/posts/editor/PostEditor";

export default async function Home() {
  const posts = await prisma.post.findMany({
    include: postDataInclude,
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <PostEditor />
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>
      <TrendSidebar />
    </main>
  );
}
