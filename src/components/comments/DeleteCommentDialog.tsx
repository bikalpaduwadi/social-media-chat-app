import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import LoadingButton from "../LoadingButton";
import { CommentData } from "@/utils/prisma";
import { useDeleteCommentMutation } from "./mutation";

interface DeleteCommentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  comment: CommentData;
}
const DeleteCommentDialog = ({
  isOpen,
  comment,
  onClose,
}: DeleteCommentDialogProps) => {
  const mutation = useDeleteCommentMutation();

  const handleOpenChange = (open: boolean) => {
    if (!open || !mutation.isPending) {
      onClose();
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete comment ?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this comment? your action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <LoadingButton
            variant={"destructive"}
            loading={mutation.isPending}
            onClick={() => mutation.mutate(comment.id, { onSuccess: onClose })}
          >
            Delete
          </LoadingButton>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteCommentDialog;
