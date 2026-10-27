export interface Attachment {
  id: string;
  todo_id: string;
  filename: string;
  content_type: string;
  size: number;
  created_at: string;
  uploader_username?: string | null;
  url?: string | null;
  attachment_count?: number | null;
}

export interface AttachmentListResponse {
  attachments: Attachment[];
}

export interface AttachmentCreate {
  filename: string;
  content_type: string;
  size: number;
}

export interface AttachmentUploadResponse {
  attachment: Attachment;
  upload_url: string;
  upload_headers: Record<string, string>;
}

export const ALLOWED_ATTACHMENT_TYPES = [
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
  "application/pdf",
];

export const MAX_ATTACHMENT_SIZE = 5 * 1024 * 1024;
