import React from "react";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "./ui/button";

interface LoadingButtonProps extends ButtonProps {
  loading: boolean;
}

const LoadingButton = (props: LoadingButtonProps) => {
  const { loading, disabled, className, ...rest } = props;

  return (
    <Button
      disabled={loading || disabled}
      className={cn("flex items-center gap-2", className)}
      {...rest}
    >
      {loading && <Loader2 className="size-5 animate-spin" />}
      {rest.children}
    </Button>
  );
};

export default LoadingButton;
