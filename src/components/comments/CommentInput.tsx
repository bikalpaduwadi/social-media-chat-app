import React, { useState } from "react";
import { Loader2, SendHorizonal } from "lucide-react";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { PostData } from "@/utils/prisma";
import { useCreateCommentMutation } from "./mutation";

interface CommentInputProps {
  post: PostData;
}

const CommentInput = ({ post }: CommentInputProps) => {
  const [input, setInput] = useState("");

  const mutation = useCreateCommentMutation(post.id);
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input) {
      return;
    }

    mutation.mutate(
      {
        post,
        content: input,
      },
      {
        onSuccess: () => setInput(""),
      },
    );
  };
  return (
    <form className="flex w-full items-center gap-2" onSubmit={onSubmit}>
      <Input
        autoFocus
        placeholder="Write a comment..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <Button
        size="icon"
        type="submit"
        variant="ghost"
        disabled={!input.trim() || mutation.isPending}
      >
        {!mutation.isPending ? (
          <SendHorizonal />
        ) : (
          <Loader2 className="animate-spin" />
        )}
      </Button>
    </form>
  );
};

export default CommentInput;
