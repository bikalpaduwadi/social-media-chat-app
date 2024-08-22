"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import { Chat as StreamChat } from "stream-chat-react";

import ChatSidebar from "./ChatSidebar";
import ChatChannel from "./ChatChannel";
import useInitializeChatClient from "./useInitializeChatClient";

const Chat = () => {
  const chatClient = useInitializeChatClient();
  const { resolvedTheme } = useTheme();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!chatClient) {
    return <Loader2 className="mx-auto my-3 animate-spin" />;
  }

  return (
    <main className="relative w-full overflow-hidden rounded-2xl bg-card shadow-sm">
      <div className="absolute bottom-0 top-0 flex w-full">
        <StreamChat
          client={chatClient}
          theme={
            resolvedTheme === "dark"
              ? "str-chat__theme-dark"
              : "str-chat__theme-light"
          }
        >
          <ChatSidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
          <ChatChannel
            isOpen={!sidebarOpen}
            openSidebar={() => setSidebarOpen(true)}
          />
        </StreamChat>
      </div>
    </main>
  );
};

export default Chat;
