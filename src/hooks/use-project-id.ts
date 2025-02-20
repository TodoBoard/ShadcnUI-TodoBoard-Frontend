import { useState, useEffect } from "react";

export function useProjectId() {
  const [projectId, setProjectId] = useState<string>("");

  useEffect(() => {
    const extractProjectId = () => {
      try {
        const url = new URL(window.location.href);
        const pathSegments = url.pathname.split("/");
        const projectSegment = pathSegments.find((segment) =>
          segment.includes("-id=")
        );

        if (!projectSegment) return;

        const idMatch = projectSegment.match(/-id=([^&]+)/);
        if (idMatch && idMatch[1]) {
          setProjectId(idMatch[1]);
        }
      } catch {
      }
    };

    extractProjectId();
  }, []);

  return projectId;
}
