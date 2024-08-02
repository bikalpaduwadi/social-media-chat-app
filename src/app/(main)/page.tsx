import HomePostFeed from "./HomePostFeed";
import TrendSidebar from "@/components/TrendSidebar";
import PostEditor from "@/components/posts/editor/PostEditor";

export default async function Home() {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <PostEditor />
        <HomePostFeed />
      </div>
      <TrendSidebar />
    </main>
  );
}
