import { useCallback } from "react";
import { useSidebar } from "@/components/ui/sidebar";

/**
 * Hook that provides a handler to close sidebar on mobile when items are clicked
 * @returns A click handler function that closes the sidebar on mobile
 */
export function useSidebarMobileClose() {
  const { isMobile, setOpenMobile } = useSidebar();
  
  const handleMobileItemClick = useCallback(() => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [isMobile, setOpenMobile]);
  
  return handleMobileItemClick;
} 