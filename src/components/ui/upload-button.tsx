// "use client";

// import { useCallback, useState } from "react";
// import { useDropzone } from "react-dropzone";
// import { generateClientDropzoneAccept } from "uploadthing/client";
// import { toast } from "sonner";
// import { Progress } from "@/components/ui/progress";
// import { Loader2, UploadCloud } from "lucide-react";

// import type { OurFileRouter } from "@/app/api/uploadthing/core";

// interface UploadButtonProps {
//   onUploadComplete: (url: string) => void;
//   endpoint: keyof OurFileRouter; // 👌 strongly typed to your router
// }

// export function UploadButton({ onUploadComplete, endpoint }: UploadButtonProps) {
//   const [isUploading, setIsUploading] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const { toast } = useToast();

//   const { startUpload } = useUploadThing(endpoint, {
//     onClientUploadComplete: (res) => {
//       setIsUploading(false);
//       const fileUrl = res?.[0]?.url;
//       if (fileUrl) {
//         onUploadComplete(fileUrl);
//       }
//     },
//     onUploadError: (error: Error) => {
//       setIsUploading(false);
//       toast({
//         title: "Upload failed",
//         description: error.message,
//         variant: "destructive",
//       });
//     },
//     onUploadProgress: (p) => {
//       setProgress(p);
//     },
//   });

//   const onDrop = useCallback(
//     (acceptedFiles: File[]) => {
//       if (acceptedFiles.length === 0) return;
//       setIsUploading(true);
//       startUpload(acceptedFiles);
//     },
//     [startUpload]
//   );

//   const fileTypes = ["image/png", "image/jpeg", "image/webp"];

//   const { getRootProps, getInputProps } = useDropzone({
//     onDrop,
//     accept: generateClientDropzoneAccept(fileTypes),
//     maxFiles: 1, // ✅ restrict to one file
//     disabled: isUploading,
//   });

//   if (isUploading) {
//     return (
//       <div className="w-full">
//         <div className="flex items-center gap-2 mb-2">
//           <Loader2 className="h-4 w-4 animate-spin" />
//           <span className="text-sm text-gray-500">Uploading...</span>
//         </div>
//         <Progress value={progress} className="h-2" />
//       </div>
//     );
//   }

//   return (
//     <div
//       {...getRootProps()}
//       className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-teal-500 transition-colors"
//     >
//       <input {...getInputProps()} />
//       <div className="space-y-2">
//         <UploadCloud className="h-8 w-8 mx-auto text-gray-400" />
//         <p className="text-sm text-gray-600">
//           Drag & drop an image here, or click to select
//         </p>
//         <p className="text-xs text-gray-500">PNG, JPG, WEBP (max 4MB)</p>
//       </div>
//     </div>
//   );
// }
