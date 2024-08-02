"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { useInfiniteQuery } from "@tanstack/react-query";

import kyInstance from "@/lib/ky";
import { PostsPage } from "@/types/post";
import Post from "@/components/posts/Post";
import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import PostsLoadingSkeleton from "@/components/posts/PostsLoadingSkeleton";

const HomePostFeed = () => {
  const {
    data,
    status,
    isPending,
    isFetching,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["post-feed", "for-you"],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          "/api/posts/for-you",
          pageParam
            ? {
                searchParams: { cursor: pageParam },
              }
            : {},
        )
        .json<PostsPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const posts = data?.pages.flatMap((page) => page.posts) || [];

  if (isPending) {
    return <PostsLoadingSkeleton />;
  }

  if (status === "success" && !posts.length && !hasNextPage) {
    return (
      <div className="text-center text-muted-foreground">No posts yet !!!</div>
    );
  }

  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        Something went wrong while loading posts
      </p>
    );
  }

  return (
    <InfiniteScrollContainer
      onBottomReached={() => {
        hasNextPage && !isFetching && fetchNextPage();
      }}
      className="space-y-5"
    >
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}

      {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
    </InfiniteScrollContainer>
  );
};

export default HomePostFeed;
