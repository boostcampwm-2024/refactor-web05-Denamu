import { useState } from "react";

import { RssRegistrationModal } from "@/components/RssRegistration/RssRegistrationModal";
import DesktopNavigation from "@/components/layout/navigation/DesktopNavigation";
import MobileNavigation from "@/components/layout/navigation/MobileNavigation";
import SearchModal from "@/components/search/SearchModal";

import { useCustomToast } from "@/hooks/common/useCustomToast.ts";
import { useKeyboardShortcut } from "@/hooks/common/useKeyboardShortcut";

import { TOAST_MESSAGES } from "@/constants/messages";

import { useMediaStore } from "@/store/useMediaStore";

export default function Header() {
  const [modals, setModals] = useState({ search: false, rss: false, login: false, chat: false });
  const { toast } = useCustomToast();
  const isMobile = useMediaStore((state) => state.isMobile);
  const toggleModal = (modalType: "search" | "rss" | "login" | "chat") => {
    if (modalType === "login") {
      toast(TOAST_MESSAGES.SERVICE_NOT_PREPARED);
      return;
    }
    setModals((prev) => ({ ...prev, [modalType]: !prev[modalType] }));
  };
  useKeyboardShortcut("k", () => toggleModal("search"), true);

  return (
    <div className="border-b border-primary/20">
      {isMobile ? <MobileNavigation toggleModal={toggleModal} /> : <DesktopNavigation toggleModal={toggleModal} />}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"></div>
      {modals.rss && <RssRegistrationModal onClose={() => toggleModal("rss")} rssOpen={modals.rss} />}
      {modals.search && <SearchModal onClose={() => toggleModal("search")} />}
    </div>
  );
}
