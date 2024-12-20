import React from "react";
import { Metadata } from "next";
import ResumeEditor from "./ResumeEditor";
import prisma from "@/lib/prisma";
import { resumeDataInclude } from "@/lib/types";
import { auth } from "@clerk/nextjs/server";

interface PageProps {
  searchParams: Promise<{ resumeId?: string }>;
}
export const metadata: Metadata = {
  title: "Design your resume",
};
const page = async ({ searchParams }: PageProps) => {
  const { resumeId } = await searchParams;
  const { userId } = await auth();
  if (!userId) {
    return null;
  }
  const resumeToEdit = resumeId
    ? await prisma.resume.findUnique({
        where: { id: resumeId, userId },
        include: resumeDataInclude,
      })
    : null;
  return (
    <div>
      <ResumeEditor resumeToEdit={resumeToEdit}></ResumeEditor>
    </div>
  );
};

export default page;
