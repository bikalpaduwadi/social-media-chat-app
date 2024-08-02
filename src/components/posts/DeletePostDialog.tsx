import React from "react";

import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { PostData } from "@/utils/prisma";
import LoadingButton from "../LoadingButton";
import { useDeletePostMutation } from "./mutation";

interface DeletePostDialogProps {
  post: PostData;
  isOpen: boolean;
  onClose: () => void;
}

const DeletePostDialog = (props: DeletePostDialogProps) => {
  const { post, isOpen, onClose } = props;

  const deleteMutation = useDeletePostMutation();

  const handleOpenChange = (open: boolean) => {
    if (!open || !deleteMutation.isPending) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete post ?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this post? your action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <LoadingButton
            variant={"destructive"}
            loading={deleteMutation.isPending}
            onClick={() =>
              deleteMutation.mutate(post.id, { onSuccess: onClose })
            }
          >
            Delete
          </LoadingButton>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={deleteMutation.isPending}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeletePostDialog;
