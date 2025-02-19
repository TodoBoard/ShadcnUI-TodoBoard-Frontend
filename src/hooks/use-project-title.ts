import { useState, useEffect } from "react";

export function useProjectTitle() {
  const [projectTitle, setProjectTitle] = useState<string>("");

  useEffect(() => {
    const extractProjectTitle = () => {
      try {
        const url = new URL(window.location.href);
        const pathSegments = url.pathname.split("/");
        const projectSegment = pathSegments.find((segment) =>
          segment.includes("-id=")
        );

        if (!projectSegment) return;

        const titlePart = projectSegment.split("-id=")[0];
        if (!titlePart) return;

        const decodedTitle = decodeURIComponent(titlePart);
        const formattedTitle = decodedTitle
          .split("-")
          .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          )
          .join(" ");

        setProjectTitle(formattedTitle);
      } catch (error) {
      }
    };

    extractProjectTitle();
  }, []);

  return projectTitle;
}
