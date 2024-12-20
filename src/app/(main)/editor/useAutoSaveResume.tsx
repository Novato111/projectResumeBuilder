// import useDebounce from "@/hooks/useDebounce";
// import { ResumeValues } from "@/lib/validation";
// import { useEffect, useState } from "react";

// export default function useAutoSaveResume(resumeData: ResumeValues) {
//   const debouncedResumeData = useDebounce(resumeData, 1500);

//   const [lastSavedData, setLastSavedData] = useState(
//     structuredClone(resumeData)
//   );

//   const [isSaving, setIsSaving] = useState(false);

//   useEffect(() => {
//     async function save() {
//       setIsSaving(true);
//       await new Promise((resolve) => setTimeout(resolve, 1500));
//       setLastSavedData(structuredClone(debouncedResumeData));
//     }

//     const hasUnsavedChanges =
//       JSON.stringify(debouncedResumeData) !== JSON.stringify(lastSavedData);

//     if (hasUnsavedChanges && debouncedResumeData && !isSaving) {
//       save();
//     }
//   }, [debouncedResumeData, isSaving, lastSavedData]);

//   return {
//     isSaving,
//     hasUnsavedChanges:
//       JSON.stringify(resumeData) !== JSON.stringify(lastSavedData),
//   };
// }
import { useToast } from "@/hooks/use-toast";
import useDebounce from "@/hooks/useDebounce";
import { ResumeValues } from "@/lib/validation";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { saveResume } from "./actions";

import { Button } from "@/components/ui/button";
import { fileReplacer } from "@/lib/utils";

export default function useAutoSaveResume(resumeData: ResumeValues) {
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [resumeId, setResumeId] = useState(resumeData.id);
  const debouncedResumeData = useDebounce(resumeData, 1500);

  const [lastSavedData, setLastSavedData] = useState(
    structuredClone(resumeData)
  );

  const [isSaving, setIsSaving] = useState(false);

  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setIsError(false);
  }, [debouncedResumeData]);

  useEffect(() => {
    async function save() {
      try {
        setIsSaving(true);
        setIsError(false);
        const newData = structuredClone(debouncedResumeData);
        //calling my actions.ts and like post
        const updateResume = await saveResume({
          ...newData,

          ...(JSON.stringify(lastSavedData.photo, fileReplacer) ===
            JSON.stringify(newData.photo, fileReplacer) && {
            photo: undefined,
          }),
          id: resumeId,
        });

        setResumeId(updateResume.id);
        setLastSavedData(newData);
        if (searchParams.get("resumeId") !== updateResume.id) {
          const newSearchParams = new URLSearchParams(searchParams);
          newSearchParams.set("resumeId", updateResume.id);
          window.history.replaceState(
            null,
            "",
            `?${newSearchParams.toString()}`
          );
        }
      } catch (error) {
        setIsError(true);
        console.error(error);
        const { dismiss } = toast({
          variant: "destructive",
          description: (
            <div className="space-y-3 ">
              <p>Culd not save changes</p>
              <Button
                variant="secondary"
                onClick={() => {
                  dismiss();
                  save();
                }}
              >
                Retry
              </Button>
            </div>
          ),
        });
      } finally {
        setIsSaving(false);
      }
    }

    const hasUnsavedChanges =
      JSON.stringify(debouncedResumeData, fileReplacer) !==
      JSON.stringify(lastSavedData, fileReplacer);

    if (hasUnsavedChanges && debouncedResumeData && !isSaving && !isError) {
      save(); // Trigger save operation
    }
  }, [debouncedResumeData, isSaving, lastSavedData, isError, resumeId]);

  return {
    isSaving,
    hasUnsavedChanges:
      JSON.stringify(resumeData) !== JSON.stringify(lastSavedData),
  };
}
