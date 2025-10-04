import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import React from "react";

type Props = {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  data: any;
};

export const CategoriesSidebar = ({ open, onOpenChange, data }: Props) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="w-80 p-0 transition-none"
        style={{ backgroundColor: "white" }}
      >
        <SheetHeader className="border-b p-4">
          <SheetTitle>Categories</SheetTitle>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};
