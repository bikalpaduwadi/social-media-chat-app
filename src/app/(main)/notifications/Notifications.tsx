"use client";

import React, { useEffect } from "react";
import { Loader2 } from "lucide-react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import kyInstance from "@/lib/ky";
import Notification from "./Notification";
import { NotificationPage } from "@/types/notification";
import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import PostsLoadingSkeleton from "@/components/posts/PostsLoadingSkeleton";

const Notifications = () => {
  const {
    data,
    status,
    isPending,
    isFetching,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["notifications"],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          "/api/notifications",
          pageParam
            ? {
                searchParams: { cursor: pageParam },
              }
            : {},
        )
        .json<NotificationPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: () => kyInstance.patch("/api/notifications/mark-as-read"),
    onSuccess: () => {
      queryClient.setQueryData(["unread-notification-count"], {
        unreadCount: 0,
      });
    },
    onError(error) {
      console.error("Failed to mark notifications as read", error);
    },
  });

  useEffect(() => {
    mutate();
  }, [mutate]);

  const notifications = data?.pages.flatMap((page) => page.notifications) || [];

  if (isPending) {
    return <PostsLoadingSkeleton />;
  }

  if (status === "success" && !notifications.length && !hasNextPage) {
    return (
      <div className="text-center text-muted-foreground">
        You don&apos;t have any notification !!!
      </div>
    );
  }

  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        Something went wrong while loading notifications
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
      {notifications.map((notification) => (
        <Notification key={notification.id} notification={notification} />
      ))}

      {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
    </InfiniteScrollContainer>
  );
};

export default Notifications;
