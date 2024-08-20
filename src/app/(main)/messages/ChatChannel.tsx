import React from "react";
import {
  Window,
  Channel,
  MessageList,
  MessageInput,
  ChannelHeader,
} from "stream-chat-react";

const ChatChannel = () => {
  return (
    <div className="w-full">
      <Channel>
        <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
      </Channel>
    </div>
  );
};

export default ChatChannel;
