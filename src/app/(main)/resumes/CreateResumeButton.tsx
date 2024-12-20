"use client";
import { Button } from "@/components/ui/button";
import usePremiumModal from "@/hooks/usePremiumModal";
import { PlusSquare } from "lucide-react";
import { tree } from "next/dist/build/templates/app-page";
import Link from "next/link";
import React from "react";

interface CreateResumeButtonProps {
  canCreate: boolean;
}
const CreateResumeButton = ({ canCreate }: CreateResumeButtonProps) => {
  const PremiumModal = usePremiumModal();
  if (canCreate) {
    return (
      <Button asChild className="mx-auto flex w-fit gap-2">
        <Link href="/editor">
          <PlusSquare className="size-5"></PlusSquare>
          New Resume
        </Link>
      </Button>
    );
  }
  return (
    <Button onClick={() => PremiumModal.setOpen(true)}>
      <PlusSquare className="size-5"></PlusSquare>
      New Resume
    </Button>
  );
};

export default CreateResumeButton;
