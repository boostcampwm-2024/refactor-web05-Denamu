import { MessageCircleMore } from "lucide-react";

import { useSidebar } from "@/components/ui/sidebar.tsx";

export function OpenChatButton() {
  const { toggleSidebar, isMobile, setOpenMobile } = useSidebar();
  if (isMobile) {
    return (
      <>
        <button
          onClick={() => {
            setOpenMobile(true);
          }}
          className="w-full"
        >
          채팅
        </button>
      </>
    );
  }

  return (
    <button
      onClick={toggleSidebar}
      className="fixed text-white bottom-[14.5rem] right-7 bg-[#3498DB] hover:bg-[#2980B9] !rounded-full p-3"
    >
      <MessageCircleMore size={25} />
    </button>
  );
}
