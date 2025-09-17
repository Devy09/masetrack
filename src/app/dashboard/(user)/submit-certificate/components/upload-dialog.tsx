"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Upload } from "lucide-react"
import DocumentUploader from "./document-uploader"
import { useState } from "react"

interface UploadDialogProps {
  trigger?: React.ReactNode
  buttonText?: string
  buttonVariant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  onSuccess?: () => void
}

export default function UploadDialog({
  trigger,
  buttonText = "Upload Documents",
  buttonVariant = "default",
  onSuccess,
}: UploadDialogProps) {
  const [open, setOpen] = useState(false)

  const defaultTrigger = (
    <Button variant={buttonVariant} className="gap-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
      <Upload className="h-4 w-4" />
      {buttonText}
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="w-[95vw] sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Documents
          </DialogTitle>
          <DialogDescription>Select or drag and drop your files to upload them to your drive.</DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <DocumentUploader onSuccess={() => {
            setOpen(false)
            onSuccess?.()
          }} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
