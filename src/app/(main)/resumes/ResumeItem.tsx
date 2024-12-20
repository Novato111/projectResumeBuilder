"use client";

import { Button } from "@/components/ui/button";
import ResumePreview from "@/components/ui/ResumePreview";
import { ResumeServerData } from "@/lib/types";
import { mapToResumeValues } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate } from "date-fns";
import { MoreVertical, Printer, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRef, useState, useTransition } from "react";
import { useToast } from "@/hooks/use-toast";
import { deleteResume } from "./actions";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import LoadingButton from "@/components/ui/LoadingButton";
import {useReactToPrint  } from "react-to-print";
interface ResumeItemProps {
  resume: ResumeServerData;
}

export default function ResumeItem({ resume }: ResumeItemProps) {

  const contentRef=useRef<HTMLDivElement>(null)
  const reactToPrintFn= useReactToPrint({
    contentRef,documentTitle: resume.title || "Resume"
  })
  const wasupdated = resume.updatedAt !== resume.createdAt;
  return (
    <div className="group relative border rounded-lg border-transparent hover:border bg-gray-300">
      <div className="space-y-3">
        <Link
          href={`/editor?resumeId=${resume.id}`}
          className="inline-block w-full text-center "
        >
          <p className="font-semibold line-clamp-1">
            {resume.title || "no title"}
          </p>
          {resume.description && (
            <p className="line-clamp-2">{resume.description}</p>
          )}
          <p className="text-xs">
            {wasupdated ? "Updated" : "Created"}on{" "}
            {formatDate(resume.updatedAt, "MMM d,yyyy h:mm a")}
          </p>
        </Link>
        <Link
          href={`/editor?resumeId=${resume.id}`}
          className=" relative inline-block w-full"
        >
          <ResumePreview
            resumeData={mapToResumeValues(resume)}
            contentRef={contentRef}
            className=" overflow-hidden shadow-sm  transition-shadow group-hover:shadow-xl"
          ></ResumePreview>
          <div className=" absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to to-transparent"></div>
        </Link>
      </div>
      <MoreMenu onPrintClick={reactToPrintFn}resumeId={resume.id}></MoreMenu>
    </div>
  );
}
interface MoreMenuProps {
  resumeId: string;
  onPrintClick: ()=>void
}
function MoreMenu({resumeId,onPrintClick}: MoreMenuProps) {
  const [showDelteConfirmation, setShowDeleteConfirmation] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0.5 top-0.5 opacity-0 transition-opacity group-hover:opacity-100"
          >
            <MoreVertical></MoreVertical>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem className="flex items-center gap-2"  onClick={() => setShowDeleteConfirmation(true)}>
           
            <Trash2 className="size-4"></Trash2>
            Delete
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center gap-2" onClick={onPrintClick}>
            <Printer className="size-4"></Printer>Print
          </DropdownMenuItem>

        </DropdownMenuContent>
      </DropdownMenu>{" "}
      <DeleteConfirmationDialog resumeId={resumeId} open={showDelteConfirmation} onOpenChange={setShowDeleteConfirmation}></DeleteConfirmationDialog>
    </>
  );
}

interface DeleteConfirmationDialogProps{
  resumeId:string,
  open:boolean,
  onOpenChange:(open:boolean)=>void
}


function DeleteConfirmationDialog ({resumeId, open, onOpenChange}:DeleteConfirmationDialogProps){


  const {toast}= useToast()
  const[isPending,startTransition]=useTransition()
  async function handleDelete(params:type) {
    
    startTransition(async()=>{
      try{
await deleteResume(resumeId)
onOpenChange(false)
      }catch(error){
        console.error(error);
        toast({
          variant:"destructive",
          description:"something went wrong. Please try again.",

        })
      }
    })
  }
  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Delete resume?</DialogTitle>
        <DialogDescription>This will permanently delete this resume. This action cannot be undone</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <LoadingButton variant="destructive"
        onClick={handleDelete}
        loading={isPending}>
Delete
        </LoadingButton>
        <Button variant='secondary' onClick={()=>onOpenChange(false)}
        >Cancel</Button>
        
      </DialogFooter>
    </DialogContent>
  </Dialog>
}
