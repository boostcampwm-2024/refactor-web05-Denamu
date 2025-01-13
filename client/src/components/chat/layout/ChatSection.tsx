import { useEffect, useRef } from "react";

import { CircleAlert } from "lucide-react";

import ChatItem from "@/components/chat/ChatItem";
import ChatSkeleton from "@/components/chat/layout/ChatSkeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

import { useChatStore } from "@/store/useChatStore";

const FullChatWarning = () => (
  <div className="flex flex-col justify-center items-center h-full mt-[30vh]">
    <CircleAlert color="red" size={200} />
    <p>채팅창 인원이 500명 이상입니다</p>
    <p>잠시 기다렸다가 새로고침을 해주세요</p>
  </div>
);

export default function ChatSection({ isFull }: { isFull: boolean }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { chatHistory } = useChatStore();

  useEffect(() => {
    if (scrollRef.current) {
      const scrollContent = scrollRef.current.querySelector("[data-radix-scroll-area-viewport]");
      if (scrollContent && chatHistory.length > 0) {
        scrollContent.scrollTo({
          top: scrollContent.scrollHeight,
          behavior: "smooth",
        });
      }
    }
  }, [chatHistory.length]);

  const RenderHistory = () => {
    if (chatHistory.length === 0) return <ChatSkeleton number={14} />;
    return isFull ? (
      <FullChatWarning />
    ) : (
      <span className="flex flex-col gap-3 px-3">
        {chatHistory.map((item) => {
          const isSameUser = chatHistory[chatHistory.indexOf(item) - 1]?.username === item.username;
          return <ChatItem key={item.timestamp} chatItem={item} isSameUser={isSameUser} />;
        })}
      </span>
    );
  };

  return (
    <ScrollArea ref={scrollRef} className="h-full">
      {RenderHistory()}
    </ScrollArea>
  );
}
