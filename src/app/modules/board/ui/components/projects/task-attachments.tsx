"use client";

import { useEffect, useRef, useState } from "react";
import { FileText, Loader2, Paperclip, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Attachments } from "@/lib/api";
import { Attachment, ALLOWED_ATTACHMENT_TYPES } from "@/models/attachments";
import { useTodosStore } from "@/store/todos";
import { Progress } from "@/components/ui/progress";

export const ATTACHMENT_ACCEPT = ALLOWED_ATTACHMENT_TYPES.join(",");

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/**
 * Uploads files one after another and keeps the todo's attachment count in sync.
 * Errors (quota, file type, ...) are shown as toasts per file.
 */
export async function uploadFiles(
  todoId: string,
  files: File[],
  onUploaded?: (attachment: Attachment) => void,
  onProgress?: (file: File, percent: number) => void
) {
  for (const file of files) {
    try {
      const attachment = await Attachments.uploadAttachment(
        todoId,
        file,
        (percent) => onProgress?.(file, percent)
      );
      onUploaded?.(attachment);
      if (typeof attachment.attachment_count === "number") {
        useTodosStore.getState().setAttachmentCount(todoId, attachment.attachment_count);
      }
    } catch (error) {
      toast.error(`${file.name}: ${typeof error === "string" ? error : "Upload failed"}`);
    }
  }
}

interface UploadProgress {
  file: File;
  percent: number;
}

interface TaskAttachmentsProps {
  todoId: string;
  editable?: boolean;
}

export function TaskAttachments({ todoId, editable = false }: TaskAttachmentsProps) {
  const [attachments, setAttachments] = useState<Attachment[] | null>(null);
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const count = useTodosStore(
    (state) => state.todos.find((t) => t.id === todoId)?.attachment_count ?? 0
  );

  // Reload when the count changes, e.g. another member uploaded something.
  useEffect(() => {
    if (attachments && attachments.length === count) return;
    Attachments.getTodoAttachments(todoId)
      .then((response) => setAttachments(response.attachments))
      .catch((error) =>
        toast.error(typeof error === "string" ? error : "Failed to load attachments")
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todoId, count]);

  const handleFiles = async (files: File[]) => {
    if (!editable || files.length === 0) return;
    setUploads((prev) => [...prev, ...files.map((file) => ({ file, percent: 0 }))]);
    await uploadFiles(
      todoId,
      files,
      (attachment) => setAttachments((prev) => [...(prev ?? []), attachment]),
      (file, percent) =>
        setUploads((prev) => prev.map((u) => (u.file === file ? { ...u, percent } : u)))
    );
    setUploads((prev) => prev.filter((u) => !files.includes(u.file)));
  };

  const handleDelete = async (attachment: Attachment) => {
    try {
      const { attachment_count } = await Attachments.deleteAttachment(attachment.id);
      setAttachments((prev) => (prev ?? []).filter((a) => a.id !== attachment.id));
      useTodosStore.getState().setAttachmentCount(todoId, attachment_count);
    } catch (error) {
      toast.error(typeof error === "string" ? error : "Failed to delete attachment");
    }
  };

  const isEmpty = !attachments?.length && uploads.length === 0;
  if (!editable && isEmpty) {
    return attachments === null ? (
      <Loader2 className="w-3 h-3 animate-spin text-gray-400" />
    ) : null;
  }

  return (
    <div
      className={cn(
        "rounded-md transition-colors",
        editable && isDragging && "bg-purple-500/10 ring-1 ring-purple-500"
      )}
      onDragOver={(e) => {
        if (!editable) return;
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        if (!editable) return;
        e.preventDefault();
        setIsDragging(false);
        handleFiles(Array.from(e.dataTransfer.files));
      }}
      onPaste={(e) => {
        if (editable && e.clipboardData.files.length > 0) {
          e.preventDefault();
          handleFiles(Array.from(e.clipboardData.files));
        }
      }}
    >
      <div className="flex flex-wrap gap-2">
        {attachments?.map((attachment) => (
          <div key={attachment.id} className="relative group">
            <a
              href={attachment.url ?? undefined}
              target="_blank"
              rel="noopener noreferrer"
              title={`${attachment.filename} (${formatFileSize(attachment.size)})`}
            >
              {attachment.content_type.startsWith("image/") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={attachment.url ?? ""}
                  alt={attachment.filename}
                  loading="lazy"
                  className="h-16 w-16 rounded-md border object-cover"
                />
              ) : (
                <div className="h-16 w-28 rounded-md border flex flex-col items-center justify-center gap-1 px-2 text-gray-500 hover:bg-muted transition-colors">
                  <FileText className="w-5 h-5" />
                  <span className="text-[10px] w-full truncate text-center">
                    {attachment.filename}
                  </span>
                </div>
              )}
            </a>
            {editable && (
              <button
                type="button"
                onClick={() => handleDelete(attachment)}
                className="absolute -top-1.5 -right-1.5 p-0.5 rounded-full bg-background border shadow-sm opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label={`Remove ${attachment.filename}`}
              >
                <X className="w-3 h-3 text-gray-500" />
              </button>
            )}
          </div>
        ))}

        {uploads.map((upload, index) => (
          <div
            key={`${upload.file.name}-${index}`}
            className="h-16 w-28 rounded-md border flex flex-col justify-center gap-1.5 px-2"
          >
            <span className="text-[10px] text-gray-500 truncate">{upload.file.name}</span>
            <Progress value={upload.percent} className="h-1" />
          </div>
        ))}
      </div>

      {editable && (
        <>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className={cn(
              "flex items-center gap-1 text-xs text-gray-500 hover:text-purple-500 transition-colors",
              !isEmpty && "mt-2"
            )}
          >
            <Paperclip className="w-3 h-3" />
            Attach files
            <span className="hidden sm:inline text-gray-400">· drop or paste</span>
          </button>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept={ATTACHMENT_ACCEPT}
            className="hidden"
            onChange={(e) => {
              handleFiles(Array.from(e.target.files ?? []));
              e.target.value = "";
            }}
          />
        </>
      )}
    </div>
  );
}
