import { StreamChat } from "stream-chat";
import { useEffect, useState } from "react";

import kyInstance from "@/lib/ky";
import { useSession } from "../SessionProvider";

const useInitializeChatClient = () => {
  const { user } = useSession();

  const [chatClient, setChatClient] = useState<StreamChat | null>(null);

  useEffect(() => {
    const client = StreamChat.getInstance(process.env.NEXT_PUBLIC_STREAM_KEY!);

    client
      .connectUser(
        {
          id: user.id,
          username: user.username,
          name: user.displayName,
          image: user.avatarUrl,
        },

        async () =>
          kyInstance
            .get("/api/get-token")
            .json<{ token: string }>()
            .then((data) => data.token),
      )
      .catch((err) => console.log("Failed to connect user", err))
      .then(() => setChatClient(client));

    return () => {
      setChatClient(null);
      client
        .disconnectUser()
        .catch((error) => console.error("Failed to disconnect user", error))
        .then(() => console.log("Connection closed"));
    };
  }, [user.id, user.displayName, user.username, user.avatarUrl]);

  return chatClient;
};

export default useInitializeChatClient;
