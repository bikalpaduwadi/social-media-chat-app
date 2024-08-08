import React, { useRef } from "react";
import { Cropper, ReactCropperElement } from "react-cropper";
import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
} from "./ui/dialog";
import { Button } from "./ui/button";

import "cropperjs/dist/cropper.css";

interface CropImageDialogProps {
  src: string;
  onClose: () => void;
  cropAspectRatio: number;
  onCropped: (blob: Blob | null) => void;
}

const CropImageDialog = ({
  src,
  onClose,
  onCropped,
  cropAspectRatio,
}: CropImageDialogProps) => {
  const cropperRef = useRef<ReactCropperElement>(null);

  const crop = () => {
    const cropper = cropperRef.current?.cropper;

    if (!cropper) {
      return;
    }

    cropper.getCroppedCanvas().toBlob((blob) => onCropped(blob), "image/webp");
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crop image</DialogTitle>
        </DialogHeader>
        <Cropper
          src={src}
          aspectRatio={cropAspectRatio}
          guides={false}
          zoomable={false}
          ref={cropperRef}
          className="mx-auto size-fit"
        />
        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={crop}>Crop</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CropImageDialog;
