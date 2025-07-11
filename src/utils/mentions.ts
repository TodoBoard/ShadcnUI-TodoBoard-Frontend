export interface MentionResult {
  cleanTitle: string;
  username?: string;
}

export function parseMention(title: string): MentionResult {
  const match = title.match(/^@(\w+)\s+(.*)$/);
  if (match) {
    return {
      username: match[1],
      cleanTitle: match[2],
    };
  }
  return { cleanTitle: title };
}

export function sanitizeTitle(title: string): string {
  return title.replace(/@\w+\s*/g, "").trim();
}

export function composeTitle(username: string | undefined | null, title: string): string {
  const base = sanitizeTitle(title);
  return username ? `@${username} ${base}`.trim() : base;
} 