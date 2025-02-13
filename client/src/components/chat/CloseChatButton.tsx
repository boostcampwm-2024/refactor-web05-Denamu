import { X } from "lucide-react";

import { useSidebar } from "@/components/ui/sidebar.tsx";

import { useSidebarStore } from "@/store/useSidebarStore.ts";

export function CloseChatButton() {
  const { toggleSidebar } = useSidebar();
  const { isOpen, setIsOpen } = useSidebarStore();
  return (
    <button
      onClick={() => {
        toggleSidebar();
        if (isOpen) setIsOpen();
      }}
    >
      <X size={16} />
    </button>
  );
}
