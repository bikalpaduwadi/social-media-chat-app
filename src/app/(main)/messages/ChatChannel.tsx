import React from "react";
import { Menu } from "lucide-react";
import {
  Window,
  Channel,
  MessageList,
  MessageInput,
  ChannelHeader,
  ChannelHeaderProps,
} from "stream-chat-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ChatChannelProps {
  isOpen: boolean;
  openSidebar: () => void;
}

const ChatChannel = ({ isOpen, openSidebar }: ChatChannelProps) => {
  return (
    <div className={cn("w-full md:block", !isOpen && "hidden")}>
      <Channel>
        <Window>
          <CustomChannelHeader openSidebar={openSidebar} />
          <MessageList />
          <MessageInput />
        </Window>
      </Channel>
    </div>
  );
};

export default ChatChannel;

interface CustomChannelHeaderProps extends ChannelHeaderProps {
  openSidebar: () => void;
}

const CustomChannelHeader = ({
  openSidebar,
  ...rest
}: CustomChannelHeaderProps) => {
  return (
    <div className="flex items-center gap-3">
      <div className="h-full p-2 md:hidden">
        <Button size="icon" variant="ghost" onClick={openSidebar}>
          <Menu className="size-5" />
        </Button>
      </div>
      <ChannelHeader {...rest} />
    </div>
  );
};
