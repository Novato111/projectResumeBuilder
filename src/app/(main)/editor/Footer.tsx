import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { steps } from "./steps";
import { FileUserIcon, PenLineIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useReactToPrint } from "react-to-print";

interface FooterProps {
  currentStep: string;
  setCurrentStep: (step: string) => void;
  showSmResumePreview: boolean;
  setShowSmResumePreview: (show: boolean) => void;
  isSaving: boolean;
}
const Footer = ({
  currentStep,
  setCurrentStep,
  showSmResumePreview,
  setShowSmResumePreview,
  isSaving,
}: FooterProps) => {
  const previousStep = steps.find(
    (_, index) => steps[index + 1]?.key === currentStep
  )?.key;

  const nextStep = steps.find(
    (_, index) => steps[index - 1]?.key === currentStep
  )?.key;

  return (
    <footer className=" sticky w-full border-t px-3 py-5">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={
              previousStep ? () => setCurrentStep(previousStep) : undefined
            }
            disabled={!previousStep}
          >
            Previous Step
          </Button>
          <Button
            disabled={!nextStep}
            onClick={nextStep ? () => setCurrentStep(nextStep) : undefined}
          >
            Next Step
          </Button>
        </div>
        <Button
          title={
            showSmResumePreview ? "show input form" : "show resume preview"
          }
          className="md:hidden"
          variant="outline"
          size="icon"
          onClick={() => setShowSmResumePreview(!showSmResumePreview)}
        >
          {showSmResumePreview ? (
            <PenLineIcon></PenLineIcon>
          ) : (
            <FileUserIcon></FileUserIcon>
          )}
        </Button>
        <div className="flex items-center gap-3 ">
          <Button variant="secondary" asChild>
            <Link href={"/resumes"}>close</Link>
          </Button>

          <p
            className={cn(
              "text-muted-foreground  opacity-0",
              isSaving && "opacity-100"
            )}
          >
            Saving...
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
