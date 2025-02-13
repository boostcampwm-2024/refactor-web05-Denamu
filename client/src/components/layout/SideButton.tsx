import { Home, ArrowUp, ChartArea } from "lucide-react";

import { Chat } from "@/components/chat/Chat";
import { OpenChatButton } from "@/components/chat/OpenChatButton";
import { SidebarProvider } from "@/components/ui/sidebar";

import { useTapStore } from "@/store/useTapStore";

export default function SideButton() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const { setTap } = useTapStore();
  return (
    <div className="flex h-full items-center ">
      <SidebarProvider defaultOpen={false}>
        <Chat />
        <OpenChatButton />
      </SidebarProvider>
      <button
        className="fixed text-white bottom-[6.5rem] right-7 bg-primary hover:bg-secondary !rounded-full p-3"
        onClick={() => {
          setTap("main");
        }}
      >
        <Home size={25} />
      </button>
      <button
        className="fixed text-white bottom-[10.5rem] right-7 bg-[#1ABC9C] hover:bg-[#16A085] !rounded-full p-3"
        onClick={() => {
          setTap("chart");
        }}
      >
        <ChartArea size={25} />
      </button>
      <button
        className="fixed text-white bottom-[2.5rem] right-7 bg-[#9B59B6] hover:bg-[#8E44AD] !rounded-full p-3"
        onClick={scrollToTop}
      >
        <ArrowUp size={25} />
      </button>
    </div>
  );
}
