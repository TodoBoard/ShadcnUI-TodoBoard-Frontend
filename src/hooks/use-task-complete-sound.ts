import { useCallback } from "react";

export function useTaskCompleteSound() {
  return useCallback(() => {
    const audio = new Audio("/sound/complete_task.mp3");
    audio.play().catch(() => {});
  }, []);
}
