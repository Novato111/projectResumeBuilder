"use client";

import { ResumeValues } from "@/lib/validation";
import { useSearchParams } from "next/navigation";
import { steps } from "./steps";

import Breadcrumbs from "./Breadcrumbs";
import Footer from "./Footer";
import { useState } from "react";

import ResumePreviewSection from "./ResumePreviewSections";
import { cn, mapToResumeValues } from "@/lib/utils";
import useUnloadWarning from "@/hooks/useUnloadWarning";
import useAutoSaveResume from "./useAutoSaveResume";
import { ResumeServerData } from "@/lib/types";

interface ResumeEditorProps {
  resumeToEdit: ResumeServerData | null;
}

export default function ResumeEditor({ resumeToEdit }: ResumeEditorProps) {
  const searchParams = useSearchParams();

  const [resumeData, setResumeData] = useState<ResumeValues>(
    resumeToEdit ? mapToResumeValues(resumeToEdit) : {}
  );
  const [showSmResumePreview, SetShowSmResumePreview] = useState(false);
  const currentStep = searchParams.get("step") || steps[0].key;

  const { isSaving, hasUnsavedChanges } = useAutoSaveResume(resumeData);
  useUnloadWarning(hasUnsavedChanges);
  function setStep(key: string) {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("step", key);
    window.history.pushState(null, "", `?${newSearchParams.toString()}`);
  }
  const FormComponent = steps.find(
    (step) => step.key === currentStep
  )?.component;

  return (
    <div className=" flex grow flex-col min-h-screen scale-90 ">
      <header className="space-y-1 border-b px-3  text-center">
        <h1 className=" text-md font-bold"> Design your resume</h1>
        <p className="text-sm text-muted-foreground">
          Fill in the details to create your resume, Your progress will be saved
          automatically
        </p>
      </header>
      <main className="relative grow transform ">
        <div className="absolute bottom-0 top-0 flex w-full ">
          <div
            className={cn(
              "w-full md:w-1/2 p-3 overflow-y-auto  md:block space-y-6",
              showSmResumePreview && "hidden"
            )}
          >
            <Breadcrumbs currentStep={currentStep} setCurrentStep={setStep} />
            {FormComponent && (
              <FormComponent
                resumeData={resumeData}
                setResumeData={setResumeData}
              ></FormComponent>
            )}
          </div>
          <div className="grow md:border-r" />
          <ResumePreviewSection
            resumeData={resumeData}
            setResumeData={setResumeData}
            className={cn(showSmResumePreview && "flex")}
          ></ResumePreviewSection>
        </div>{" "}
      </main>

      <Footer
        currentStep={currentStep}
        setCurrentStep={setStep}
        showSmResumePreview={showSmResumePreview}
        setShowSmResumePreview={SetShowSmResumePreview}
        isSaving={isSaving}
      ></Footer>
    </div>
  );
}
