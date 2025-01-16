import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

import { Chat } from "../chat/Chat";
import { OpenChat } from "../chat/ChatButton";
import { SidebarProvider } from "../ui/sidebar";
import { useTapStore } from "@/store/useTapStore";

type SideBarType = {
  handleRssModal: () => void;
  handleLoginModal: () => void;
  handleSidebar: () => void;
};

export default function SideBar({ handleRssModal, handleLoginModal, handleSidebar }: SideBarType) {
  const navigate = useNavigate();
  const { tap, setTap } = useTapStore();
  const actionAndClose = (fn: () => void) => {
    fn();
    handleSidebar();
  };
  return (
    <div className="flex flex-col gap-4 p-4">
      <Button onClick={() => navigate("/about")} variant="outline">
        서비스 소개
      </Button>
      <Button variant="outline" className="w-full" onClick={() => actionAndClose(handleLoginModal)}>
        로그인
      </Button>
      {tap === "main" ? (
        <Button variant="outline" onClick={() => actionAndClose(() => setTap("chart"))}>
          차트
        </Button>
      ) : (
        <Button variant="outline" onClick={() => actionAndClose(() => setTap("main"))}>
          홈
        </Button>
      )}
      <Button variant="outline" className="overflow-hidden">
        <SidebarProvider>
          <Chat />
          <OpenChat />
        </SidebarProvider>
      </Button>
      <Button variant="default" className="w-full bg-primary" onClick={() => actionAndClose(handleRssModal)}>
        블로그 등록
      </Button>
    </div>
  );
}
