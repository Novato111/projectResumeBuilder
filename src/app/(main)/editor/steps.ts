import React from "react";
import GeneralInfoform from "./forms/GeneralInfoform";
import PersonalInfoForm from "./forms/PersonalInfoForm";
import { EditorFormProps } from "@/lib/types";
import WorkExperienceForm from "./forms/WorkExperienceForm";
import EducationForm from "./forms/EducationForm";
import SkillsForm from "./forms/SkillsForm";
import SummaryForm from "./forms/SummaryForm";

export const steps: {
  title: string;
  component: React.ComponentType<EditorFormProps>;
  key: string;
}[] = [
  { title: "General Info", component: GeneralInfoform, key: "general-info" },
  { title: "Personal", component: PersonalInfoForm, key: "personal-info" },
  {
    title: "Work Experience",
    component: WorkExperienceForm,
    key: "work-experience",
  },

  { title: "Education", component: EducationForm, key: "education" },
  {
    title: "Skills ",
    component: SkillsForm,
    key: "skills",
  },
  {
    title: "Summary ",
    component: SummaryForm,
    key: "Summary",
  },
];
