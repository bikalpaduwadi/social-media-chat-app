"use client";

import React, { useState } from "react";

import { UserData } from "@/utils/prisma";
import { Button } from "@/components/ui/button";
import EditProfileDialog from "./EditProfileDialog";

interface EditProfileButtonProps {
  user: UserData;
}

const EditProfileButton = ({ user }: EditProfileButtonProps) => {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <Button variant="outline" onClick={() => setShowDialog(true)}>
        EditProfileButton
      </Button>
      <EditProfileDialog
        user={user}
        isOpen={showDialog}
        onOpenChange={setShowDialog}
      />
    </>
  );
};

export default EditProfileButton;
