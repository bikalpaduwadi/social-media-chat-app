"use client";

import Image from "next/image";
import React, { useRef } from "react";
import StarterKit from "@tiptap/starter-kit";
import { ImageIcon, Loader2, X } from "lucide-react";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/UserAvatar";
import { useCreatePostMutation } from "./mutations";
import LoadingButton from "@/components/LoadingButton";
import { useSession } from "@/app/(main)/SessionProvider";
import useMediaUpload, { Attachment } from "./useMediaUpload";

import "./style.css";

const PostEditor = () => {
  const { user } = useSession();
  const postMutation = useCreatePostMutation();

  const {
    reset: resetMediaUpload,
    startUpload,
    isUploading,
    attachments,
    uploadProgress,
    removeAttachment,
  } = useMediaUpload();

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        bold: false,
        italic: false,
      }),
      Placeholder.configure({
        placeholder: "Create your content here",
      }),
    ],
  });

  const input =
    editor?.getText({
      blockSeparator: "\n",
    }) || "";

  const onSubmit = () => {
    postMutation.mutate(
      {
        content: input,
        mediaIds: attachments
          .map((attachment) => attachment.mediaId)
          .filter(Boolean) as string[],
      },
      {
        onSuccess: () => {
          editor?.commands.clearContent();
          resetMediaUpload();
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex gap-5">
        <UserAvatar avatarUrl={user.avatarUrl} className="hidden sm:inline" />
        <EditorContent
          editor={editor}
          className="max-h-[20rem] w-full overflow-y-auto rounded-2xl bg-background px-5 py-3"
        />
      </div>
      {!!attachments.length && (
        <AttachmentPreviews
          attachments={attachments}
          removeAttachment={removeAttachment}
        />
      )}
      <div className="flex items-center justify-end gap-3">
        {isUploading && (
          <>
            <span className="text-sm">{uploadProgress ?? 0}%</span>
            <Loader2 className="size-5 animate-spin text-primary" />
          </>
        )}
        <AddAttachmentsButton
          onFilesSelected={startUpload}
          disabled={isUploading || attachments.length > 5}
        />
        <LoadingButton
          disabled={!input.trim() || isUploading}
          onClick={onSubmit}
          loading={postMutation.isPending}
          className="min-w-20"
        >
          Post
        </LoadingButton>
      </div>
    </div>
  );
};

export default PostEditor;

interface AddAttachmentsButtonProps {
  onFilesSelected: (files: File[]) => void;
  disabled: boolean;
}

const AddAttachmentsButton = ({
  onFilesSelected,
  disabled,
}: AddAttachmentsButtonProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Button
        size="icon"
        variant="ghost"
        className="text-primary hover:text-primary"
        disabled={disabled}
        onClick={() => fileInputRef.current?.click()}
      >
        <ImageIcon size={20} />
      </Button>

      <input
        type="file"
        multiple
        ref={fileInputRef}
        className="sr-only hidden"
        accept="image/*, video/*"
        onChange={(e) => {
          const files = Array.from(e.target.files || []);

          if (files.length) {
            onFilesSelected(files);
            e.target.value = "";
          }
        }}
      />
    </>
  );
};

interface AttachmentPreviewProps {
  attachment: Attachment;
  onRemoveClick: () => void;
}

const AttachmentPreview = ({
  attachment: { file, mediaId, isUploading },
  onRemoveClick,
}: AttachmentPreviewProps) => {
  const src = URL.createObjectURL(file);

  return (
    <div
      className={cn("relative mx-auto size-fit", isUploading && "opacity-50")}
    >
      {file.type.startsWith("image") ? (
        <Image
          src={src}
          alt="Attachment preview"
          width={50}
          height={50}
          className="size-fit max-h-[30rem] rounded-2xl"
        />
      ) : (
        <video controls className="size-fit max-h-[30rem] rounded-2xl">
          <source src={src} type={file.type} />
        </video>
      )}
      {!isUploading && (
        <button
          onClick={onRemoveClick}
          className="absolute right-3 top-3 rounded-full bg-foreground p-1.5 text-background transition-colors hover:bg-background/60"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
};

interface AttachmentPreviewsProps {
  attachments: Attachment[];
  removeAttachment: (file: string) => void;
}

const AttachmentPreviews = ({
  attachments,
  removeAttachment,
}: AttachmentPreviewsProps) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        attachments.length > 1 && "sm:grid sm:grid-cols-2",
      )}
    >
      {attachments.map((attachment) => (
        <AttachmentPreview
          key={attachment.file.name}
          attachment={attachment}
          onRemoveClick={() => removeAttachment(attachment.file.name)}
        />
      ))}
    </div>
  );
};
